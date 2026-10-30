/**
 * FirehoseConsumer -- a Durable Object holding the single, long-lived
 * connection to Bluesky's Jetstream (a JSON-over-WebSocket re-stream of the
 * AT Protocol firehose, filtered server-side via `wantedCollections`) and
 * writing matching governance records into the Worker's KV cache.
 *
 * Why Jetstream, not the raw firehose: the raw AT Protocol firehose streams
 * CBOR-encoded CAR blocks and requires a full repo-diff/MST-walk to extract
 * records. Jetstream does that work upstream and re-streams plain JSON
 * commit events, pre-filterable by collection NSID -- dramatically simpler
 * and a much better fit for a Workers runtime with no native CBOR/CAR
 * tooling. See https://github.com/bluesky-social/jetstream.
 *
 * IMPORTANT cost/architecture note, confirmed against Cloudflare's own docs
 * (not assumed): Durable Object WebSocket hibernation only applies when the
 * DO acts as a WebSocket *server* (an inbound client upgrade accepted via
 * `ctx.acceptWebSocket()`). An *outbound* connection -- which is what this
 * is, since the DO is the client connecting out to Jetstream -- does NOT
 * hibernate. Cloudflare's docs state outbound sockets keep the DO resident
 * in memory (billable active duration) for up to 15 minutes after the last
 * I/O, extended by further I/O. In practice, on a live stream this means
 * the DO stays resident close to continuously while connected, which is
 * the correct behavior for "maintain a firehose connection" but is NOT
 * free the way an idle hibernating DO would be. This is a deliberate
 * tradeoff for a real-time feed; a cron-based poller would be cheaper but
 * not real-time. Flagging for awareness before this is deployed.
 */
import { DurableObject } from 'cloudflare:workers';

export interface FirehoseEnv {
  FEED_CACHE: KVNamespace;
}

// All four public Jetstream instances Bluesky operates, cycled through on
// reconnect so a single region outage doesn't stall the consumer.
const JETSTREAM_HOSTS = [
  'jetstream1.us-east.bsky.network',
  'jetstream2.us-east.bsky.network',
  'jetstream1.us-west.bsky.network',
  'jetstream2.us-west.bsky.network',
];

// Jetstream supports full-segment NSID prefix wildcards (e.g.
// "app.bsky.graph.*") but not partial-segment ones -- this covers all 5
// current governance lexicons and any future ones added under the same
// namespace without needing a code change.
const WANTED_COLLECTIONS = 'com.aegisfederation.governance.*';

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const WATCHDOG_INTERVAL_MS = 60_000; // re-check connection health every minute
const MAX_BACKOFF_MS = 10 * 60_000; // cap reconnect backoff at 10 minutes

/** Shared with index.ts so the KV prefix convention lives in one place. */
export const FEED_KV_PREFIXES = {
  'aegis-all': 'all',
  'aegis-critical': 'critical',
  'aegis-incidents': 'incidents',
} as const;

interface JetstreamCommitEvent {
  did: string;
  time_us: number;
  kind: 'commit' | 'identity' | 'account';
  commit?: {
    rev: string;
    operation: 'create' | 'update' | 'delete';
    collection: string;
    rkey: string;
    record?: Record<string, unknown>;
    cid?: string;
  };
}

export class FirehoseConsumer extends DurableObject<FirehoseEnv> {
  private ws: WebSocket | null = null;
  private hostIndex = 0;
  private reconnectCount = 0;
  private connectedAt: number | null = null;
  private lastEventAt: number | null = null;
  private lastError: string | null = null;

  constructor(ctx: DurableObjectState, env: FirehoseEnv) {
    super(ctx, env);
    // No connection logic here -- opening a WebSocket is external I/O, and
    // DO best practice is to keep the constructor minimal (especially
    // since outbound sockets re-run the constructor on every DO wake, per
    // the memory-eviction behavior above). ensureConnected() is called
    // explicitly by the Worker's fetch handler and by the alarm watchdog.
  }

  /** RPC: idempotent -- opens a connection only if one isn't already live. */
  async ensureConnected(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      await this.armWatchdog();
      return;
    }
    await this.openJetstreamConnection();
    await this.armWatchdog();
  }

  /** RPC: health-check data for the Worker's /health endpoint. */
  async getStatus(): Promise<{
    connected: boolean;
    connectedAt: number | null;
    lastEventAt: number | null;
    reconnectCount: number;
    lastError: string | null;
  }> {
    return {
      connected: this.ws?.readyState === WebSocket.OPEN,
      connectedAt: this.connectedAt,
      lastEventAt: this.lastEventAt,
      reconnectCount: this.reconnectCount,
      lastError: this.lastError,
    };
  }

  private async openJetstreamConnection(): Promise<void> {
    const host = JETSTREAM_HOSTS[this.hostIndex % JETSTREAM_HOSTS.length];
    const cursor = await this.ctx.storage.get<number>('cursor');
    const params = new URLSearchParams({ wantedCollections: WANTED_COLLECTIONS });
    if (cursor) params.set('cursor', String(cursor));

    const url = `https://${host}/subscribe?${params.toString()}`;
    try {
      const resp = await fetch(url, { headers: { Upgrade: 'websocket' } });
      const ws = resp.webSocket;
      if (!ws) {
        throw new Error(`No WebSocket in response (status ${resp.status})`);
      }
      // Standard (non-hibernating) client API -- see the module doc
      // comment on why this cannot use ctx.acceptWebSocket().
      ws.accept();
      ws.addEventListener('message', (event) => this.handleMessage(event));
      ws.addEventListener('close', () => this.handleDisconnect('close'));
      ws.addEventListener('error', () => this.handleDisconnect('error'));
      this.ws = ws;
      this.connectedAt = Date.now();
      this.lastError = null;
      this.reconnectCount = 0;
    } catch (err) {
      this.lastError = err instanceof Error ? err.message : String(err);
      this.hostIndex += 1;
      this.scheduleReconnect();
    }
  }

  private handleDisconnect(_reason: 'close' | 'error'): void {
    this.ws = null;
    this.connectedAt = null;
    this.hostIndex += 1; // try the next host on the next attempt
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    this.reconnectCount += 1;
    const backoff = Math.min(1000 * 2 ** this.reconnectCount, MAX_BACKOFF_MS);
    this.ctx.waitUntil(this.ctx.storage.setAlarm(Date.now() + backoff));
  }

  private async armWatchdog(): Promise<void> {
    const existing = await this.ctx.storage.getAlarm();
    if (existing === null) {
      await this.ctx.storage.setAlarm(Date.now() + WATCHDOG_INTERVAL_MS);
    }
  }

  /**
   * Alarm serves two roles: a reconnect retry (scheduled with backoff by
   * scheduleReconnect) and a periodic watchdog (re-armed by armWatchdog)
   * that re-asserts the connection is live even if a close/error event was
   * somehow missed. Either way, calling ensureConnected() is the right
   * response -- it's a no-op if already connected.
   */
  async alarm(): Promise<void> {
    await this.ensureConnected();
  }

  private async handleMessage(event: MessageEvent): Promise<void> {
    this.lastEventAt = Date.now();
    let parsed: JetstreamCommitEvent;
    try {
      parsed = JSON.parse(typeof event.data === 'string' ? event.data : '');
    } catch {
      return; // malformed frame -- drop, don't crash the consumer
    }

    if (parsed.kind !== 'commit' || !parsed.commit) return;
    const { operation, collection, rkey, record } = parsed.commit;
    if (operation === 'delete' || !record) return; // skeleton feed: nothing to serve for a delete

    await this.ctx.storage.put('cursor', parsed.time_us);
    await this.storeRecord(parsed.did, collection, rkey, parsed.time_us, record);
  }

  private async storeRecord(
    did: string,
    collection: string,
    rkey: string,
    timeUs: number,
    record: Record<string, unknown>,
  ): Promise<void> {
    // Lexicographic KV ordering is ascending-only, so the timestamp is
    // inverted to make ascending key order equal newest-first chronological
    // order -- getFeedSkeleton lists each feed's prefix directly, no
    // client-side sort or post-filtering needed.
    const inverted = String(Number.MAX_SAFE_INTEGER - timeUs).padStart(16, '0');
    const suffix = `${inverted}:${did}:${rkey}`;
    const atUri = `at://${did}/${collection}/${rkey}`;
    const payload = (record.payload ?? {}) as Record<string, unknown>;
    const severity = typeof payload.severity === 'string' ? payload.severity : undefined;

    // Written into one key per feed it qualifies for (a record can appear
    // in multiple feeds), so each feed's KV prefix is independently and
    // correctly paginable with a single list() call -- no need to
    // over-fetch-then-filter, which would make cursor pagination behave
    // inconsistently for sparse filtered feeds.
    const feedPrefixes: Array<(typeof FEED_KV_PREFIXES)[keyof typeof FEED_KV_PREFIXES]> = [
      FEED_KV_PREFIXES['aegis-all'],
    ];
    if (severity === 'critical' || severity === 'high') feedPrefixes.push(FEED_KV_PREFIXES['aegis-critical']);
    if (collection.endsWith('.incidentNotice')) feedPrefixes.push(FEED_KV_PREFIXES['aegis-incidents']);

    const ttlSeconds =
      typeof record.ttl_seconds === 'number' && record.ttl_seconds > 0
        ? record.ttl_seconds
        : DEFAULT_TTL_SECONDS;
    const expirationTtl = Math.max(ttlSeconds, 60); // KV requires >= 60s

    // KV list() returns each key's `metadata` without a separate get() per
    // key, so getFeedSkeleton never needs a secondary read to build the
    // skeleton response.
    await Promise.all(
      feedPrefixes.map((feed) =>
        this.env.FEED_CACHE.put(`item:${feed}:${suffix}`, '1', {
          expirationTtl,
          metadata: { atUri },
        }),
      ),
    );
  }
}
