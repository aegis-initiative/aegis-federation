---
title: "Charter"
description: "Charter, scope, and goals of the AEGIS Governance Federation Network"
sidebar:
  order: 2
---

# Charter

## Purpose

The **AEGIS Governance Federation Network (GFN)** exists to enable cooperative defense for AI governance. It defines an open specification for sharing governance intelligence — risk signals, circumvention techniques, policy updates, attestations, and incident disclosures — across a federation of independent AI systems and the organizations that operate them.

## Mission

Establish governance intelligence sharing as a **standard ecosystem capability** — analogous to vulnerability disclosure (CVE) and threat intelligence sharing (ISACs) in cybersecurity — so that defensive insights compound across the AI ecosystem instead of remaining siloed within individual organizations.

## In Scope

The GFN specification defines:

- **Signal vocabulary** — canonical event types and payload schemas for governance signals.
- **Identity and signing** — DID-based participant identity, cryptographic signing, replay protection.
- **Trust evaluation** — a normative model for evaluating publisher credibility without central authority.
- **Feed taxonomy** — a stable namespace for discovering and subscribing to signal categories.
- **Node architecture** — reference architecture for components that publish, ingest, and apply signals.
- **Conformance** — what a conforming implementation MUST, SHOULD, and MAY do.

## Out of Scope

The GFN specification deliberately does not define:

- **Local enforcement mechanisms** — what a node does internally with received signals (handled by each operator's local policy engine; reference patterns are documented but non-normative).
- **AI runtime behavior** — how AI agents themselves should be designed; the GFN governs the *reporting layer*, not the agent layer.
- **Wire-level transport innovation** — the GFN uses [AT Protocol](https://atproto.com) for federation. New transport primitives are not introduced.
- **Centralized governance** — there is no GFN authority that can mandate participation or override local node decisions. Federation signals are advisory.

## Governance Principles

1. **Open specification** — all normative content is published under CC BY-SA 4.0 and may be implemented by any party without permission.
2. **No gatekeepers** — participation requires only a valid DID and conformance to the specification. AEGIS Initiative is the originator and the largest reference implementation, not a membership authority.
3. **Local autonomy is non-negotiable** — federation signals never override an operator's local policy. Receivers retain final decision authority, always.
4. **Backwards-compatible evolution** — schema additions are additive; breaking changes are versioned with explicit migration guidance and supported overlap periods.
5. **Transparent change control** — all specification changes flow through the [RFC process](/rfc/), with public discussion and explicit acceptance criteria.

## Origin and Stewardship

The GFN-1 specification originated within the AEGIS Initiative and was first published in March 2026. AEGIS Initiative operates the reference implementation and maintains the canonical specification at [aegis-federation.com](https://aegis-federation.com).

The specification is intended to outgrow its origin. Future stewardship may transition to a multi-stakeholder body if and when ecosystem adoption justifies it. Until that transition is formally proposed via RFC, AEGIS Initiative serves as steward in the same way MITRE serves as steward for STIX/TAXII: as the most credible publisher and the default reference, not as the network's controller.
