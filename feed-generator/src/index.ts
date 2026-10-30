/**
 * AEGIS Governance Federation — Feed Generator
 * Cloudflare Worker that serves curated governance intelligence feeds
 * from the AT Protocol network.
 */
import { FirehoseConsumer, FEED_KV_PREFIXES } from './firehose-consumer';

export { FirehoseConsumer };

export interface Env {
  // Cloudflare KV namespace for caching feed data, written by FirehoseConsumer
  FEED_CACHE: KVNamespace;
  // Durable Object holding the single persistent Jetstream connection
  FIREHOSE: DurableObjectNamespace<FirehoseConsumer>;
}

// Feed generator DID
const FEED_GENERATOR_DID = 'did:web:aegis-federation.com';

type FeedId = keyof typeof FEED_KV_PREFIXES;

// Available feeds
const FEEDS: Record<FeedId, { uri: string; displayName: string; description: string }> = {
  'aegis-all': {
    uri: `at://${FEED_GENERATOR_DID}/app.bsky.feed.generator/aegis-all`,
    displayName: 'AEGIS Governance — All Signals',
    description: 'All governance intelligence signals from the AEGIS Federation Network',
  },
  'aegis-critical': {
    uri: `at://${FEED_GENERATOR_DID}/app.bsky.feed.generator/aegis-critical`,
    displayName: 'AEGIS Governance — Critical Only',
    description: 'Critical and high-severity governance signals only',
  },
  'aegis-incidents': {
    uri: `at://${FEED_GENERATOR_DID}/app.bsky.feed.generator/aegis-incidents`,
    displayName: 'AEGIS Governance — Incidents',
    description: 'Incident notices from the AEGIS Federation Network (see RFC-0009: the legacy '
      + '"active incidents" filter by status has no GFN-1 equivalent -- incident_notice.v1 is a '
      + 'point-in-time disclosure, not a mutable ticket)',
  },
};

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

function firehose(env: Env) {
  return env.FIREHOSE.getByName('singleton');
}

/** Extracts the feed rkey from the getFeedSkeleton `feed` param, which per
 * the app.bsky.feed.getFeedSkeleton lexicon is the full feed generator
 * record AT-URI, not a bare id. */
function feedIdFromAtUri(feedParam: string | null): FeedId | null {
  if (!feedParam) return null;
  const rkey = feedParam.split('/').pop();
  return rkey && rkey in FEEDS ? (rkey as FeedId) : null;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Opportunistic, idempotent keep-alive: every request nudges the
    // firehose consumer to (re)connect if it isn't already. Cheap when
    // already connected (single RPC call, no-op inside). Not awaited --
    // this must never add latency to a feed read.
    ctx.waitUntil(firehose(env).ensureConnected());

    // Well-known DID document
    if (path === '/.well-known/did.json') {
      return Response.json({
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: FEED_GENERATOR_DID,
        service: [{
          id: '#atproto_feed_generator',
          type: 'AtprotoFeedGenerator',
          serviceEndpoint: 'https://aegis-federation.com',
        }],
      });
    }

    // Describe feed generator
    if (path === '/xrpc/app.bsky.feed.describeFeedGenerator') {
      return Response.json({
        did: FEED_GENERATOR_DID,
        feeds: Object.values(FEEDS).map((f) => ({ uri: f.uri })),
      });
    }

    // Get feed skeleton
    if (path === '/xrpc/app.bsky.feed.getFeedSkeleton') {
      const feedId = feedIdFromAtUri(url.searchParams.get('feed'));
      if (!feedId) {
        return Response.json(
          { error: 'UnknownFeed', message: 'Unrecognized feed URI' },
          { status: 400 },
        );
      }

      const limitParam = Number(url.searchParams.get('limit'));
      const limit = Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(Math.floor(limitParam), MAX_LIMIT)
        : DEFAULT_LIMIT;
      const cursor = url.searchParams.get('cursor') ?? undefined;

      try {
        const prefix = `item:${FEED_KV_PREFIXES[feedId]}:`;
        const result = await env.FEED_CACHE.list<{ atUri: string }>({ prefix, cursor, limit });
        return Response.json({
          feed: result.keys.map((k) => ({ post: k.metadata?.atUri ?? '' })).filter((p) => p.post),
          cursor: result.list_complete ? undefined : result.cursor,
        });
      } catch (err) {
        return Response.json(
          { error: 'InternalError', message: err instanceof Error ? err.message : String(err) },
          { status: 500 },
        );
      }
    }

    // Health check
    if (path === '/health') {
      try {
        const status = await firehose(env).getStatus();
        return Response.json({ ok: status.connected, firehose: status });
      } catch (err) {
        return Response.json(
          { ok: false, error: err instanceof Error ? err.message : String(err) },
          { status: 503 },
        );
      }
    }

    return new Response('AEGIS Governance Federation Network', { status: 200 });
  },
};
