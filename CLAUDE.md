# CLAUDE.md — aegis-federation

## Project

AEGIS Governance Federation Network — open specification and reference implementation for decentralized governance intelligence sharing on the AT Protocol. This repository now hosts the canonical GFN-1 specification (previously distributed across `aegis-governance`); the federation site at aegis-federation.com is the published spec.

## Org Context

- GitHub Org: github.com/aegis-initiative
- Operating Entity: AEGIS Operations LLC
- Trademark Owner: Finnoybu IP LLC
- Spec Domain: aegis-federation.com (canonical GFN-1 specification)

## This Repo's Role

Single source of truth for the AEGIS Federation. Contains:

- The canonical GFN-1 specification (published at aegis-federation.com)
- AT Protocol Lexicon schemas
- Reference feed generator (Cloudflare Worker)
- Reference PDS configuration
- Federation RFC series

Anything related to AEGIS Federation should land here, not in sibling repos. Federation content previously held in `aegis-governance/federation/` and `aegis-governance/site/src/content/docs/federation/` is being migrated/redirected to this repository.

## Repo Structure

- `/site` — Astro site at aegis-federation.com — homepage + spec + RFCs + roadmap
  - `site/src/content/docs/` — markdown source for the published specification
  - `site/src/content/docs/spec/` — GFN-1 normative documents
  - `site/src/content/docs/rfc/` — federation RFCs
  - `site/src/content/docs/roadmap/` — planned RFCs and future extensions
  - `site/src/content/docs/overview/` — charter, design principles, glossary
- `/lexicons` — AT Protocol Lexicon record schemas
- `/feed-generator` — Cloudflare Worker reference implementation of `app.bsky.feed.generator`
- `/pds` — Personal Data Server configuration and deployment docs

## Stack

- **Site**: Astro 6 + content collections + Pagefind, design system from `@aegis-initiative/design-system`
- **Feed Generator**: TypeScript, Cloudflare Workers, AT Protocol SDK
- **Lexicons**: JSON (AT Protocol Lexicon v1 format)
- **PDS**: AT Protocol Personal Data Server reference deployment

## Key Conventions

- Specification source markdown lives under `site/src/content/docs/`. Frontmatter requires `title`; `description` is recommended.
- Specification version: GFN-1 (current v1.0). Schema-level versions are independent of the spec bundle (e.g., `governance.risk_signal.v1`).
- Lexicon schemas follow AT Protocol Lexicon v1 specification. **Note: existing lexicon definitions predate GFN-1 v1.0 and use a different namespace structure (`com.aegisfederation.governance.*` with camelCase fields). Realignment to match the GFN-1 schema spec is a tracked migration item — see README.md.**
- Feed generator implements `app.bsky.feed.generator` XRPC interface
- DID format: `did:aegis:<network>:<node-identifier>` (e.g., `did:aegis:mainnet:aegis-initiative`)
- Branch: main is protected; all changes via PR
- Commit style: conventional commits (feat:, docs:, chore:, fix:)
- RFC numbering follows the broader AEGIS RFC series — federation-specific RFCs (e.g., RFC-0008) are mirrored here from aegis-governance

## Related Repos

- aegis-initiative — public site, analysis, press
- aegis-constitution — governance charter
- aegis-governance — technical specifications hub for the broader AEGIS architecture (RFCs not specific to federation continue to live there)
- aegis-docs — operator-facing platform documentation
