# CLAUDE.md — aegis-federation

## Project

AEGIS Governance Federation Network — decentralized governance intelligence sharing via the AT Protocol. Contains the
feed generator (Cloudflare Worker), AT Protocol Lexicon schemas, PDS configuration, and the federation landing page.

## Org Context

- GitHub Org: github.com/aegis-initiative
- Operating Entity: AEGIS Operations LLC
- Trademark Owner: Finnoybu IP LLC
- Domain: aegis-federation.com (federation network), aegissystems.app (main platform)

## This Repo's Role

Implements the AEGIS Governance Federation Network — the decentralized governance signal sharing layer built on AT
Protocol. Federation participants publish and subscribe to governance signals (attestations, incidents, policy updates,
risk advisories) using standardized Lexicon schemas.

## Repo Structure

- /lexicons — AT Protocol Lexicon schemas for governance record types
- /feed-generator — Cloudflare Worker that curates governance signal feeds
- /pds — Personal Data Server configuration and deployment docs
- /site — Astro landing page at aegis-federation.com
- /docs — Architecture documentation

## Stack

- **Feed Generator**: TypeScript, Cloudflare Workers, AT Protocol
- **Lexicons**: JSON (AT Protocol Lexicon format)
- **Website**: Astro, HTML/CSS
- **PDS**: AT Protocol Personal Data Server

## Key Conventions

- Lexicon schemas follow AT Protocol Lexicon v1 specification
- All governance record types use the `com.aegisfederation.governance.*` namespace
- Feed generator implements `app.bsky.feed.generator` XRPC interface
- Branch: main is protected; all changes via PR
- Commit style: conventional commits (feat:, docs:, chore:, fix:)

## Related Repos

- aegis — Governance hub (specs and doctrine that this repo implements)
- aegis-core — Enforcement engine (consumes governance signals from the federation)
- aegis-platform — Production platform (publishes signals to the federation)
- aegis-ops — Operational backbone (deploys federation infrastructure)
