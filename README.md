<p align="center">
  <a href="https://github.com/aegis-initiative"><img
  src="https://img.shields.io/badge/org-aegis--initiative-0084e7?style=flat-square&logo=github" alt="Org"></a>
  <a href="https://aegis-federation.com"><img
  src="https://img.shields.io/badge/spec-aegis--federation.com-0084e7?style=flat-square" alt="Specification"></a>
  <img src="https://img.shields.io/badge/visibility-public-lightgrey?style=flat-square" alt="Public">
</p>

# AEGIS Governance Federation Network

> **Specification + reference implementation for decentralized governance intelligence sharing on the AT Protocol.**

[![License: CC-BY-SA-4.0](https://img.shields.io/badge/license-CC--BY--SA--4.0-blue.svg)](./LICENSE) [![GFN-1 v1.0](https://img.shields.io/badge/GFN--1-v1.0%20Normative-success?style=flat-square)](https://aegis-federation.com/spec/)

---

## What this is

The **AEGIS Governance Federation Network (GFN)** is a decentralized infrastructure for sharing AI governance intelligence — circumvention reports, risk signals, policy updates, attestations, and incident notices — across independent AI systems and the organizations that operate them. It is a **cooperative defense model for AI governance**, analogous to threat-intelligence sharing systems used in cybersecurity (CVEs, ISACs).

This repository contains:

- **The canonical specification** (GFN-1 v1.0) — published as a docs site at [aegis-federation.com](https://aegis-federation.com).
- **The AT Protocol Lexicon schemas** for governance record types.
- **A reference feed generator** (Cloudflare Worker) that curates governance feeds from the AT Protocol firehose.
- **Personal Data Server (PDS) configuration** for the reference network operator.

Everything required to understand, implement, or operate against the GFN lives in this repository.

## Status

**GFN-1 v1.0 is normative and stable.** Read the specification at [aegis-federation.com/spec/](https://aegis-federation.com/spec/).

The reference network is operated by AEGIS Initiative. The specification is open and may be implemented by anyone; participation does not require AEGIS approval.

## Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      aegis-federation                        │
│                                                              │
│  ┌────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│  │   site/    │    │ feed-generator/  │    │     pds/     │  │
│  │            │    │                  │    │              │  │
│  │  Astro:    │    │   Cloudflare     │    │ AT Protocol  │  │
│  │  GFN-1     │◄───│      Worker      │◄───│   Personal   │  │
│  │  Spec      │    │                  │    │     Data     │  │
│  │  Site      │    │  Curates feeds   │    │    Server    │  │
│  │            │    │  from firehose   │    │              │  │
│  └────────────┘    └──────────────────┘    └──────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                       lexicons/                          ││
│  │  AT Protocol Lexicon record schemas for governance       ││
│  │  signals, attestations, capabilities, incidents, and     ││
│  │  policy updates.                                         ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

## Specification

The full specification is published at **[aegis-federation.com](https://aegis-federation.com)** and consists of:

| Section | URL |
|---|---|
| Overview / Charter | [/overview/](https://aegis-federation.com/overview/) |
| GFN-1 Network architecture | [/spec/network/](https://aegis-federation.com/spec/network/) |
| Node Reference Architecture | [/spec/node-architecture/](https://aegis-federation.com/spec/node-architecture/) |
| Event Schemas | [/spec/schema/](https://aegis-federation.com/spec/schema/) |
| Trust Model | [/spec/trust-model/](https://aegis-federation.com/spec/trust-model/) |
| Feed Taxonomy | [/spec/feeds/](https://aegis-federation.com/spec/feeds/) |
| Conformance | [/spec/conformance/](https://aegis-federation.com/spec/conformance/) |
| RFCs | [/rfc/](https://aegis-federation.com/rfc/) |
| Roadmap | [/roadmap/](https://aegis-federation.com/roadmap/) |

The specification source markdown lives in [`site/src/content/docs/`](./site/src/content/docs/).

## Identity

Federation participants are identified by **Decentralized Identifiers (DIDs)** in the format `did:aegis:<network>:<node-identifier>`. AEGIS Initiative operates the reference network; other organizations may stand up their own networks (or join consortiums) under the same specification.

The reference network is identified as `did:aegis:mainnet`. Test/dev networks use `did:aegis:testnet`. Consortium-private networks use `did:aegis:consortium-<id>`.

There is **no membership gate**. Any party may operate a node and publish to the federation, subject to the trust evaluation rules defined in the [Trust Model](https://aegis-federation.com/spec/trust-model/). Trust accumulates with consistent accuracy and decays with inactivity or contradictions; defection is rapidly self-correcting under the formal incentive analysis.

## Repository Layout

| Directory | Purpose |
|---|---|
| `site/` | Astro site at [aegis-federation.com](https://aegis-federation.com) — homepage, GFN-1 specification, RFCs, roadmap |
| `lexicons/` | AT Protocol Lexicon schemas for governance record types |
| `feed-generator/` | Cloudflare Worker reference implementation of `app.bsky.feed.generator` for governance feeds |
| `pds/` | Configuration for the AEGIS Initiative Personal Data Server |
| `docs/` | Architecture documentation (mirror of relevant sections from the spec site) |

## Development

```bash
# Documentation site
cd site && npm install && npm run dev
# Site available at http://localhost:4321

# Feed generator
cd feed-generator && npm install && npm run dev
```

## Contributing

Specification changes flow through the [RFC process](https://aegis-federation.com/rfc/). Open an RFC as a PR against [`site/src/content/docs/rfc/`](./site/src/content/docs/rfc/).

Code changes (feed generator, lexicons, tooling) follow conventional commits and the repository's PR template. See [`.github/pull_request_template.md`](.github/pull_request_template.md).

### Known migration items

- **Lexicon alignment.** The current Lexicon record definitions in `lexicons/com/aegisfederation/governance/` were authored before GFN-1 v1.0 and do not yet match the canonical event types in the [Event Schemas](https://aegis-federation.com/spec/schema/) section. Realignment is tracked in [RFC-0009 (high priority)](https://aegis-federation.com/rfc/0009/); until that RFC is Final, the specification (snake_case event-type names like `governance.risk_signal.v1`) is authoritative for new implementations and the existing Lexicons should be considered legacy.
- **PDS deployment.** The reference PDS at `did:aegis:mainnet:aegis-initiative` is not yet deployed. Configuration is documented in [`pds/README.md`](./pds/README.md).

## Related Repositories

| Repo | Role |
|------|------|
| [aegis-initiative](https://github.com/aegis-initiative/aegis-initiative) | Public site for AEGIS Initiative — analysis, press, and policy engagement |
| [aegis-constitution](https://github.com/aegis-initiative/aegis-constitution) | Public governance charter |
| [aegis-governance](https://github.com/aegis-initiative/aegis-governance) | Technical specifications hub for the broader AEGIS architecture |
| [aegis-docs](https://github.com/aegis-initiative/aegis-docs) | Operator-facing documentation for the AEGIS platform |

## License

The AEGIS Federation specification is released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The reference implementation in this repository is dual-licensed; see [LICENSE](./LICENSE) for details.

Operated by **AEGIS Operations LLC**.

AEGIS™ and *"Capability without constraint is not intelligence™"* are trademarks of **Finnoybu IP LLC**, used under license by **AEGIS Operations LLC**.
