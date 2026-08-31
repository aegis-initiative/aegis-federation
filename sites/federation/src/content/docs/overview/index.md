---
title: "Introduction"
description: "AEGIS Governance Federation Network — decentralized governance intelligence sharing for AI systems"
sidebar:
  order: 1
---

# AEGIS Governance Federation Network

The **AEGIS Governance Federation Network (GFN)** is a decentralized infrastructure for sharing AI governance intelligence between independent systems.

Modern AI systems operate in increasingly complex and adversarial environments. Individual organizations attempting to enforce governance controls in isolation face several recurring challenges:

- rapidly evolving circumvention techniques
- fragmented safety standards
- lack of shared risk intelligence
- inconsistent governance posture across ecosystems

The GFN addresses these by enabling AI systems to **publish and subscribe to governance signals** — circumvention reports, risk telemetry, policy updates, attestations, and incident notices — across an open, federated network. The result is a **cooperative defense model for AI governance**, analogous to threat-intelligence sharing systems used in cybersecurity (CVEs, ISACs).

---

## What This Site Defines

This site is the **canonical specification** for the AEGIS Governance Federation Network. It is organized as follows:

- **[Overview](/overview/)** — Charter, design principles, and glossary.
- **[Specification](/spec/)** — The normative GFN-1 specification: network topology, node architecture, event schemas, trust model, feed taxonomy, and conformance.
- **[RFCs](/rfc/)** — Versioned technical proposals that extend or amend the specification.
- **[Roadmap](/roadmap/)** — Planned future RFCs, including extensions for AI-operational signals (drift, evals, behavioral observations).
- **[Releases](/releases/)** — Release history for this site and the federation infrastructure.

---

## Who This Is For

- **AI platform operators** publishing governance posture, ingesting risk signals, or both.
- **Standards bodies and policy authorities** distributing normative governance frameworks.
- **Researchers** observing and contributing to the federation intelligence ecosystem.
- **Implementers** building AEGIS-compatible nodes, gateways, or clients.

The specification is **open** and the network is **federated**: no single organization controls participation. AEGIS Initiative is the originator of GFN-1 and operates the reference network, but the specification is intended to be implemented by anyone.

---

## Layer Cake

The GFN is built on existing open standards rather than reinventing wire-level primitives. Where the specification fits in the stack:

| Layer | Provided By |
|-------|-------------|
| Governance signal vocabulary, trust model, feed taxonomy, conformance | **AEGIS Federation (this specification)** |
| Federated identity, signed records, firehose, relay | [AT Protocol](https://atproto.com) |
| Transport / TLS | TLS 1.3 |
| Network | Internet protocols |

The GFN specification is **not a new wire protocol**. It is a vocabulary and semantic layer that defines *what* governance signals look like, *how* they are evaluated, and *what* a conforming node must do — leveraging AT Protocol for the underlying federation primitives.

---

## Status

GFN-1 v1.0 is normative and stable. The reference network is operated by AEGIS Initiative at [aegis-federation.com](https://aegis-federation.com). Future extensions — including AI-operational signal types (model drift, evaluation results, behavioral observations) — are tracked on the [Roadmap](/roadmap/).

---

## License

The AEGIS Federation specification is released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The reference implementation in the aegis-federation repository (private) is dual-licensed; see the repository's `LICENSE` file for details.

AEGIS™ and *"Capability without constraint is not intelligence™"* are trademarks of AEGIS Initiative, used under license by AEGIS Initiative.
