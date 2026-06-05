/**
 * AEGIS Governance Federation — Feed Generator
 * Cloudflare Worker that serves curated governance intelligence feeds
 * from the AT Protocol network.
 */

export interface Env {
  // Cloudflare KV namespace for caching feed data
  FEED_CACHE: KVNamespace;
}

// Feed generator DID
const FEED_GENERATOR_DID = 'did:web:aegis-federation.com';

// Available feeds
const FEEDS = {
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
    description: 'Active governance incident notifications',
  },
} as const;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

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
        feeds: Object.values(FEEDS).map(f => ({ uri: f.uri })),
      });
    }

    // Get feed skeleton
    if (path === '/xrpc/app.bsky.feed.getFeedSkeleton') {
      const feed = url.searchParams.get('feed');
      // TODO: Implement actual feed generation from AT Protocol firehose
      return Response.json({
        feed: [],
        cursor: '',
      });
    }

    return new Response('AEGIS Governance Federation Network', { status: 200 });
  },
};
