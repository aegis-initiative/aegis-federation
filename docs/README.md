# AEGIS Governance Federation Network — Architecture

This document describes the architecture of the AEGIS Governance Federation Network (GFN) and how its three components interconnect.

## System Overview

The GFN is a decentralized governance intelligence sharing system built on the [AT Protocol](https://atproto.com). It enables AEGIS-governed entities to publish and subscribe to governance signals across a federated network.

```
                                AT Protocol Network
                    ┌───────────────────────────────────────┐
                    │                                       │
  ┌─────────┐      │   ┌─────────┐       ┌──────────────┐  │      ┌─────────────┐
  │  AEGIS   │──────┼──▶│  PDS    │──────▶│    Relay     │──┼─────▶│  External   │
  │ Platform │      │   │         │       │   (BGS)      │  │      │ Subscribers │
  └─────────┘      │   └────┬────┘       └──────┬───────┘  │      └─────────────┘
                    │        │                    │          │
                    │        │         ┌──────────▼────────┐ │
                    │        │         │  Feed Generator   │ │
                    │        │         │  (CF Worker)      │ │
                    │        │         └──────────┬────────┘ │
                    │        │                    │          │
                    └────────┼────────────────────┼──────────┘
                             │                    │
                    ┌────────▼────────────────────▼──────────┐
                    │              Website                    │
                    │          (Astro @ aegis-federation.com) │
                    └────────────────────────────────────────┘
```

## Component Architecture

### 1. Personal Data Server (PDS)

**Directory**: `/pds`

The PDS is the authoritative data store for the AEGIS Federation. It:

- Hosts the `did:web:aegis-federation.com` identity
- Stores all governance records in AT Protocol repositories
- Syncs records to the relay network via the repository sync protocol
- Handles authentication for record publishing via XRPC

**Data Flow**: AEGIS Platform --> PDS --> Relay Network

The AEGIS Platform (aegis-platform) publishes governance records to the PDS via the `com.atproto.repo.createRecord` XRPC endpoint. The PDS then propagates these records through the AT Protocol relay network.

### 2. Feed Generator

**Directory**: `/feed-generator`

The feed generator is a Cloudflare Worker that implements the AT Protocol feed generator interface (`app.bsky.feed.generator`). It:

- Subscribes to the AT Protocol firehose (relay stream)
- Filters for `com.aegisfederation.governance.*` records
- Curates records into themed feeds (all signals, critical only, incidents)
- Serves feed skeletons via the `app.bsky.feed.getFeedSkeleton` XRPC endpoint
- Caches feed data in Cloudflare KV for low-latency reads

**Feeds**:

| Feed ID | Description | Filter Criteria |
|---------|-------------|-----------------|
| `aegis-all` | All governance signals | All `com.aegisfederation.governance.*` records |
| `aegis-critical` | Critical signals only | Records with `severity: "critical"` or `severity: "high"` |
| `aegis-incidents` | Active incidents | `com.aegisfederation.governance.incident` records with `status != "resolved"` |

**DID Resolution**: The feed generator serves its own `did:web` document at `/.well-known/did.json`, declaring itself as an `AtprotoFeedGenerator` service.

### 3. Website

**Directory**: `/site`

An Astro static site deployed to aegis-federation.com. It serves as:

- Public landing page explaining the GFN
- Documentation hub for federation participants
- Live dashboard showing governance signal activity (planned)

### 4. Lexicon Schemas

**Directory**: `/lexicons`

AT Protocol Lexicon schemas define the governance record types. These schemas are the contract between all federation participants — any entity publishing or consuming governance data must conform to these schemas.

**Namespace**: `com.aegisfederation.governance.*`

| Schema | Key Type | Purpose |
|--------|----------|---------|
| `signal` | `tid` | Governance intelligence signals |
| `attestation` | `tid` | Compliance attestations |
| `capability` | `tid` | Capability set declarations |
| `incident` | `tid` | Incident notifications |
| `policy` | `tid` | Policy updates |

## Data Flow

### Publishing a Governance Signal

```
1. AEGIS Core detects a governance event
2. AEGIS Platform formats a signal record per the Lexicon schema
3. Platform publishes to PDS via com.atproto.repo.createRecord
4. PDS signs the record with the federation DID key
5. PDS pushes the commit to the relay network
6. Feed generator receives the record from the firehose
7. Feed generator indexes the record into appropriate feeds
8. Subscribers receive the signal via feed subscription
```

### Verifying an Attestation

```
1. Entity requests attestation from AEGIS governance
2. AEGIS Core evaluates entity against capability set
3. Attestation record is published to PDS with entity DID, capability set, and validity period
4. External parties can verify by:
   a. Resolving the attestation record from the PDS
   b. Verifying the signing DID matches an authorized AEGIS federation member
   c. Checking the validity period and governance version
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Cloudflare                              │
│                                                            │
│  ┌──────────────────┐    ┌──────────────────────────────┐  │
│  │  DNS + CDN       │    │  Workers                     │  │
│  │                  │    │                              │  │
│  │  aegis-          │    │  aegis-federation-feed       │  │
│  │  federation.com  │    │  (feed generator)            │  │
│  └────────┬─────────┘    └──────────────────────────────┘  │
│           │                                                │
│  ┌────────▼─────────┐    ┌──────────────────────────────┐  │
│  │  Pages            │    │  KV                          │  │
│  │                  │    │                              │  │
│  │  Site (Astro)    │    │  FEED_CACHE                  │  │
│  └──────────────────┘    └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                     AEGIS Infrastructure                    │
│                                                            │
│  ┌──────────────────┐    ┌──────────────────────────────┐  │
│  │  PDS Server      │    │  AEGIS Platform              │  │
│  │                  │    │                              │  │
│  │  AT Protocol     │◄───│  Publishes governance        │  │
│  │  Personal Data   │    │  records via XRPC            │  │
│  │  Server          │    │                              │  │
│  └──────────────────┘    └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Security Considerations

- All governance records are cryptographically signed by the publishing DID
- DID resolution uses `did:web` with TLS verification
- PDS requires invite codes for new accounts (no open registration)
- Feed generator runs on Cloudflare Workers (isolated V8 runtime)
- Admin credentials stored as environment variables, never in code
