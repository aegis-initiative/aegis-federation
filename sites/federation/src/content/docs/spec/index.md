---
title: "Specification"
description: "The AEGIS Governance Federation Network specification (GFN-1)"
sidebar:
  order: 1
---

# GFN-1 Specification

This section is the **normative specification** for AEGIS Governance Federation Network version 1 (GFN-1). It defines what a conforming implementation must do, what data structures the network uses, and how trust is evaluated between nodes.

The specification is split into five normative documents plus a conformance summary:

| Section | Document | Status |
|---|---|---|
| [Network](/spec/network/) | GFN-1 Governance Intelligence & Federated Architecture | Normative v1.0 |
| [Node Architecture](/spec/node-architecture/) | Node Reference Architecture & Deployment | Normative v1.0 |
| [Event Schemas](/spec/schema/) | Canonical event envelope and payload schemas | Normative v1.0 |
| [Trust Model](/spec/trust-model/) | Trust scoring, Sybil resistance, revocation | Normative v1.0 |
| [Feed Taxonomy](/spec/feeds/) | Canonical feed namespace and subscription guidance | Normative v1.0 |
| [Conformance](/spec/conformance/) | MUST/SHOULD/MAY summary for implementers | Normative v1.0 |

---

## Reading order

If you're new to the specification, read in this order:

1. **[Network](/spec/network/)** — high-level architecture and design principles.
2. **[Event Schemas](/spec/schema/)** — the canonical event envelope and the five payload types.
3. **[Trust Model](/spec/trust-model/)** — how nodes evaluate and weight signals from each other.
4. **[Feed Taxonomy](/spec/feeds/)** — feed namespace conventions and subscription profiles.
5. **[Node Architecture](/spec/node-architecture/)** — operational guidance for implementers.
6. **[Conformance](/spec/conformance/)** — the testable requirements summary.

---

## Versioning

The current authoritative version is **GFN-1 v1.0**, frozen on 2026-03-26. The version applies to the specification *bundle* — all six documents move together.

Schema-level versioning (event types like `governance.risk_signal.v1`) is independent of specification versioning. New event types and additive fields can ship without bumping GFN-1. Breaking changes to existing event types require either an `event_type` major-version bump or a new GFN specification version.

The [RFC process](/rfc/) governs all changes.

---

## Status of normative requirements

Throughout the specification, the keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

A conforming implementation:

- Implements every **MUST** requirement.
- Implements every **SHOULD** requirement unless documented justification is provided.
- May implement **MAY** features at the implementer's discretion.

See [Conformance](/spec/conformance/) for the consolidated requirements list.
