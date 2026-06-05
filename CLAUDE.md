# CLAUDE.md — aegis-federation

## Identity

You maintain **aegis-federation** — the single source of truth for the AEGIS Governance Federation Network
(GFN-1): an open specification and reference implementation for decentralized governance intelligence sharing
on the AT Protocol. This repo hosts the canonical GFN-1 specification (previously distributed across
`aegis-governance`); the site at aegis-federation.com is the published spec. Anything related to AEGIS
Federation lands here, not in sibling repos.

## Repository catalog

- `sites/federation/` — Astro site at aegis-federation.com (homepage + spec + RFCs + roadmap)
  - `sites/federation/src/content/docs/` — markdown source for the published specification
  - `sites/federation/src/content/docs/spec/` — GFN-1 normative documents
  - `sites/federation/src/content/docs/rfc/` — federation RFCs
  - `sites/federation/src/content/docs/roadmap/` — planned RFCs and future extensions
  - `sites/federation/src/content/docs/overview/` — charter, design principles, glossary
- `lexicons/` — AT Protocol Lexicon record schemas
- `feed-generator/` — Cloudflare Worker reference implementation of `app.bsky.feed.generator`
- `pds/` — Personal Data Server configuration and deployment docs

## Data registry

- **GFN-1 specification (canonical source)**: `sites/federation/src/content/docs/spec/`
- **Federation RFCs**: `sites/federation/src/content/docs/rfc/`
- **Lexicon schemas**: `lexicons/` (AT Protocol Lexicon v1 format)
- **Feed generator config**: `feed-generator/wrangler.toml`

## Publication registry

- **Published specification**: [aegis-federation.com](https://aegis-federation.com) — GFN-1 (current v1.0)
- **Release notes**: `sites/federation/src/content/docs/releases/` (per-site CalVer pipeline)

## People & contacts

- **Primary maintainer**: Ken (sole maintainer during pre-ratification)
- **Reviewer routing**: `.github/CODEOWNERS`

## Identifier registry

- **GitHub Org**: [github.com/aegis-initiative](https://github.com/aegis-initiative)
- **Operating Entity**: AEGIS Initiative
- **Trademark Owner**: AEGIS Initiative (public attribution rule — internal IP-holder context lives in the
  workspace CLAUDE.md, never in public repo content)
- **Spec Domain**: aegis-federation.com (canonical GFN-1 specification)
- **Spec version**: GFN-1 v1.0 (schema-level versions are independent, e.g. `governance.risk_signal.v1`)
- **DID format**: `did:aegis:<network>:<node-identifier>` (e.g. `did:aegis:mainnet:aegis-initiative`)
- **License**: see repo `LICENSE` (full dual-license matrix in the workspace CLAUDE.md)

## Cross-repo pointers

- **aegis-initiative** — public site, analysis, press
- **aegis-constitution** — governance charter
- **aegis-governance** — technical specifications hub for the broader AEGIS architecture (RFCs not specific to
  federation live there); federation content previously under `aegis-governance/federation/` migrated here
- **aegis-docs** — operator-facing platform documentation

Ecosystem-wide structure and the full specialist-role matrix live in the workspace-level CLAUDE.md
(`d:/dev/AEGIS Initiative/CLAUDE.md`), inherited automatically — not duplicated here.

## Responsibilities

- Maintain the canonical GFN-1 specification and the federation RFC series
- Keep lexicon schemas aligned with the spec (realignment tracked in RFC-0009)
- Maintain the reference feed generator and PDS configuration
- Ensure federation content lands here rather than in sibling repos

## Conventions specific to this repo

- **Stack**: Astro 6 + content collections + Pagefind, design system from `@aegis-initiative/design-system`;
  feed generator in TypeScript on Cloudflare Workers (AT Protocol SDK); lexicons in JSON (Lexicon v1); PDS is
  an AT Protocol Personal Data Server reference deployment
- Specification source markdown lives under `sites/federation/src/content/docs/`. Frontmatter requires
  `title`; `description` is recommended.
- Lexicon schemas follow AT Protocol Lexicon v1. **Existing definitions predate GFN-1 v1.0 and use a
  different namespace (`com.aegisfederation.governance.*`, camelCase fields); realignment is tracked in
  [RFC-0009](https://aegis-federation.com/rfc/0009/) (high priority).**
- Feed generator implements the `app.bsky.feed.generator` XRPC interface
- RFC numbering follows the broader AEGIS RFC series — federation-specific RFCs (e.g. RFC-0008) are mirrored
  here from aegis-governance
- Branch: `main` protected, all changes via PR; conventional commits (`feat:`, `docs:`, `chore:`, `fix:`)

## Live state pointers

- **Active issues**: `gh issue list --repo aegis-initiative/aegis-federation`
- **Recent activity**: `git log --since='14 days ago'`
- **Lexicon realignment**: [RFC-0009](https://aegis-federation.com/rfc/0009/)

## Addendum files

None yet. Create under `.claude/` when needed (e.g. `GOTCHAS.md`, `CONTACTS.md`).
