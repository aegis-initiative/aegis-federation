<p align="center">
  <img src="https://img.shields.io/badge/ip--owner-Finnoybu%20IP%20LLC-blueviolet?style=flat-square" alt="IP Owner">
  <a href="https://github.com/aegis-initiative"><img src="https://img.shields.io/badge/org-aegis--initiative-0084e7?style=flat-square&logo=github" alt="Org"></a>
  <a href="https://aegis-federation.com"><img src="https://img.shields.io/badge/domain-aegis--federation.com-0084e7?style=flat-square" alt="Domain"></a>
  <img src="https://img.shields.io/badge/visibility-public-lightgrey?style=flat-square" alt="Public">
</p>

# AEGIS Governance Federation Network

> Decentralized governance intelligence sharing via the AT Protocol

[![License: CC-BY-SA-4.0](https://img.shields.io/badge/license-CC--BY--SA--4.0-blue.svg)](./LICENSE)

## Overview

The **AEGIS Governance Federation Network (GFN)** is a decentralized system for sharing governance intelligence signals across the AEGIS ecosystem. Built on the [AT Protocol](https://atproto.com), it enables federated organizations to publish and subscribe to governance signals — compliance attestations, policy updates, incident notifications, and risk advisories — using an open, interoperable protocol.

Unlike centralized governance reporting systems, the GFN leverages AT Protocol's federated architecture to ensure no single entity controls the flow of governance information. Each participant operates their own Personal Data Server (PDS) and publishes governance records using standardized Lexicon schemas.

## Architecture

The GFN consists of three components:

```
┌─────────────────────────────────────────────────────────┐
│                    aegis-federation                      │
│                                                         │
│  ┌──────────┐    ┌──────────────────┐    ┌───────────┐  │
│  │   site/   │    │ feed-generator/  │    │   pds/    │  │
│  │          │    │                  │    │           │  │
│  │  Astro   │    │   Cloudflare     │    │ AT Proto  │  │
│  │ Landing  │◄───│    Worker        │◄───│  Personal │  │
│  │  Page    │    │                  │    │   Data    │  │
│  │          │    │  Curates feeds   │    │  Server   │  │
│  │          │    │  from firehose   │    │           │  │
│  └──────────┘    └──────────────────┘    └───────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              lexicons/                              │ │
│  │  AT Protocol Lexicon schemas for governance         │ │
│  │  signals, attestations, capabilities, incidents,    │ │
│  │  and policy updates                                 │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 1. Personal Data Server (PDS) — `pds/`

The PDS is the data origin. It hosts the DID document for `did:web:aegis-federation.com` and stores all governance records published by the AEGIS Federation. Other PDS instances across the AT Protocol network can subscribe to this data.

### 2. Feed Generator — `feed-generator/`

A Cloudflare Worker that implements the `app.bsky.feed.generator` interface. It subscribes to the AT Protocol firehose, filters for governance-related Lexicon records, and serves curated feeds:

| Feed | Description |
|------|-------------|
| `aegis-all` | All governance intelligence signals |
| `aegis-critical` | Critical and high-severity signals only |
| `aegis-incidents` | Active governance incident notifications |

### 3. Website — `site/`

An Astro-powered landing page at [aegis-federation.com](https://aegis-federation.com) that explains the GFN, displays live governance signal feeds, and provides onboarding documentation for federation participants.

## AT Protocol Integration

The GFN uses AT Protocol's Lexicon schema system to define governance record types. All schemas live in `lexicons/` and follow the AT Protocol Lexicon specification.

### Lexicon Schemas

| Schema | Purpose |
|--------|---------|
| `com.aegisfederation.governance.signal` | Governance intelligence signals (risk alerts, advisories, anomalies) |
| `com.aegisfederation.governance.attestation` | Compliance attestations for governed entities |
| `com.aegisfederation.governance.capability` | Declared capability sets with risk classifications |
| `com.aegisfederation.governance.incident` | Governance incident notifications with timelines |
| `com.aegisfederation.governance.policy` | Policy updates (new policies, amendments, deprecations) |

### How Federation Works

1. **Publish** — An AEGIS-governed entity publishes a governance record to their PDS using the Lexicon schemas
2. **Relay** — The AT Protocol relay network propagates the record across the federation
3. **Filter** — The feed generator subscribes to the firehose and curates signals by type and severity
4. **Consume** — Federation participants subscribe to curated feeds or query the firehose directly

## Registration Model

Federation membership follows a trust-based model:

- **Tier 1 — Core Federation**: AEGIS-operated PDS instances with full signal publishing rights
- **Tier 2 — Verified Participants**: Organizations that have completed AEGIS governance attestation and operate their own PDS
- **Tier 3 — Observers**: Read-only access to governance feeds via the feed generator

All participants are identified by DIDs (Decentralized Identifiers), ensuring cryptographic verification of signal authorship.

## Phase Plan

### Phase 1 — Foundation (Current)
- [x] Define Lexicon schemas for governance record types
- [x] Scaffold feed generator (Cloudflare Worker)
- [x] Create landing page
- [ ] Deploy PDS instance at `aegis-federation.com`
- [ ] Register `did:web:aegis-federation.com`

### Phase 2 — Signal Infrastructure
- [ ] Implement firehose subscription in feed generator
- [ ] Build signal ingestion pipeline
- [ ] Deploy feed generator to Cloudflare
- [ ] Add live signal display to website

### Phase 3 — Federation
- [ ] Onboard first external federation participant
- [ ] Implement attestation verification
- [ ] Build federation dashboard
- [ ] Publish governance signal SDK

### Phase 4 — Scale
- [ ] Multi-relay support
- [ ] Signal aggregation and analytics
- [ ] Automated compliance monitoring
- [ ] Cross-federation interoperability

## Development

```bash
# Feed generator
cd feed-generator && npm install && npm run dev

# Website
cd site && npm install && npm run dev
```

## Related Repos

| Repo | Role |
|------|------|
| [aegis](https://github.com/aegis-initiative/aegis) | Governance hub — specs and doctrine |
| [aegis-core](https://github.com/aegis-initiative/aegis-core) | Enforcement engine |
| [aegis-platform](https://github.com/aegis-initiative/aegis-platform) | Production platform |
| [aegis-constitution](https://github.com/aegis-initiative/aegis-constitution) | Public governance charter |
| [aegis-ops](https://github.com/aegis-initiative/aegis-ops) | Operational backbone |

## License

Proprietary — Finnoybu IP LLC. All rights reserved.

See [LICENSE](./LICENSE) for details.
