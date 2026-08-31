---
title: "Conformance"
description: "Conformance requirements for AEGIS Federation implementations"
sidebar:
  order: 6
---

# GFN-1 Conformance

This document consolidates the normative requirements scattered through the GFN-1 specification into a single testable checklist. An implementation claiming GFN-1 conformance MUST satisfy every requirement marked **MUST**.

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

---

## Conformance levels

GFN-1 defines three implementation tiers. An implementation declares its tier in its public attestation and is held to the requirements of that tier and all lower tiers.

### Tier 1 — Consumer

Implements signal ingestion, verification, and trust evaluation. Does not publish.

**Use case:** observers, research nodes, downstream tools that consume but never originate signals.

**Required:** Identity (§I), Verification (§V), Trust Evaluation (§T), Audit (§A).

### Tier 2 — Publisher

Tier 1 plus the ability to publish signed events to one or more feeds.

**Use case:** AI platform operators, attestation publishers, incident reporters.

**Required:** Tier 1 + Publication (§P).

### Tier 3 — Federation Node

Tier 2 plus the ability to operate as a relay or feed generator, redistributing curated signals to other nodes.

**Use case:** policy authorities, ISAC-like consortia, public governance nodes.

**Required:** Tier 2 + Relay (§R).

---

## §I — Identity

**I.1 (MUST)** All federation participants are identified by a DID matching the format `did:aegis:<network>:<node-identifier>` where `<node-identifier>` matches `^[a-z0-9][a-z0-9.-]*$`. See [Trust Model §2.1](/spec/trust-model/#21-identity-verification-mandatory).

**I.2 (MUST)** Each DID has a resolvable DID document containing at least one signing public key.

**I.3 (MUST)** Signing keys use ed25519 (preferred) or rsa-sha256 (legacy). Keys MUST have a documented validity period.

**I.4 (SHOULD)** Implementations rotate signing keys on a documented schedule (recommended: 90 days).

**I.5 (SHOULD)** Key rotation events are published to the federation as attestations.

---

## §V — Verification

**V.1 (MUST)** Every received event has its envelope signature verified before any further processing.

**V.2 (MUST)** Signature verification uses the public key referenced by the envelope's `key_id`, retrieved from the publisher's DID document.

**V.3 (MUST)** Events with invalid signatures are rejected immediately and logged.

**V.4 (MUST)** Event timestamps are validated within ±5 minutes of the receiver's clock (default; configurable in `[±2 min, ±10 min]`). Events outside the window are rejected.

**V.5 (MUST)** Replay protection: each `(publisher_did, event_id)` pair MUST be unique within a configurable replay window (minimum: 24 hours). Duplicates are rejected.

**V.6 (MUST)** All required fields per the event's declared `event_type` are present and validate against the canonical schema.

**V.7 (MUST)** Unknown fields in event payloads are ignored, not rejected (forward-compatibility).

---

## §T — Trust Evaluation

**T.1 (MUST)** Implementations compute a publisher trust score per the formula in [Trust Model §3.7](/spec/trust-model/#37-normative-trust-score-formula): `T = 0.30B + 0.25H + 0.20Q + 0.15A + 0.10F`.

**T.2 (MUST)** Trust scores are clamped to `[0.0, 1.0]`.

**T.3 (MUST)** Authority class assignment is deterministic: identical inputs produce identical classifications across all conforming nodes.

**T.4 (MUST)** Trust score decay is applied per [Trust Model §3.8](/spec/trust-model/#38-trust-score-decay): `T_decayed = T · e^(-λt)` with `λ = 0.01` and `t` in days since last evidence update. Implementations MUST treat `t` as an explicit, logged input.

**T.5 (MUST)** Ingestion disposition follows the precedence rule in [Trust Model §10.1.1](/spec/trust-model/#1011-class-vs-score-conflict--precedence-rule-normative): when authority class disposition and score-based disposition conflict, the more restrictive disposition applies.

**T.6 (MUST)** Trust revocations are logged in an append-only register published in machine-readable form. See [Trust Model §8.5](/spec/trust-model/#85-revocation-transparency).

**T.7 (SHOULD)** Implementations support all four bootstrap mechanisms in [Trust Model §5](/spec/trust-model/#5-trust-bootstrap-mechanisms) (allowlist, consortium, transitive endorsement, accelerated onboarding).

**T.8 (MUST NOT)** The federation publisher trust score MUST NOT be applied to agent runtime trust decisions. See [RFC-0004 §5](/rfc/0004/) for the explicit prohibition and scope boundary.

---

## §A — Audit

**A.1 (MUST)** Every event-ingestion decision is logged with: timestamp, event_id, publisher_did, decision (ACCEPT/REJECT/QUARANTINE), trust factors at decision time, and any thresholds applied. See [Trust Model §11.1](/spec/trust-model/#111-mandatory-audit-logs).

**A.2 (MUST)** Audit logs are append-only. Existing entries cannot be modified or deleted.

**A.3 (MUST)** Audit logs include integrity proofs (cryptographic hash chain or equivalent) computed at least daily.

**A.4 (SHOULD)** Implementations support audit log queries by time range, event type, and publisher DID.

**A.5 (MAY)** Implementations publish quarterly trust audit reports per [Trust Model §11.2](/spec/trust-model/#112-compliance-reports).

---

## §P — Publication (Tier 2+)

**P.1 (MUST)** Published events use the canonical envelope per [Schema §2](/spec/schema/#2-aegis-event-envelope-required).

**P.2 (MUST)** Each event's envelope is signed using a key listed in the publisher's DID document with the matching `key_id`.

**P.3 (MUST)** JSON canonicalization of the envelope (excluding the `signature` field) is deterministic before signing. Sorted keys, normalized whitespace.

**P.4 (MUST)** Each event's `event_id` is globally unique. UUID format strongly recommended.

**P.5 (MUST)** Publishers do not include raw exploit prompts or step-by-step bypass instructions in events with `visibility = public`. See [Schema §4](/spec/schema/#4-circumvention-report).

**P.6 (SHOULD)** Publishers respect the feed taxonomy in [Feed Taxonomy](/spec/feeds/), publishing to the least-sensitive feed that conveys the intended utility.

**P.7 (SHOULD)** Publishers include `tags`, `confidence`, and `references` fields where applicable.

---

## §R — Relay (Tier 3)

**R.1 (MUST)** Relay nodes verify event signatures and schemas before redistributing.

**R.2 (MUST)** Relay nodes do not modify event payloads or envelopes during redistribution.

**R.3 (MUST)** Relay nodes preserve the original publisher's DID and signature in redistributed events.

**R.4 (SHOULD)** Relay nodes apply rate limits per publisher per [Trust Model §6.2.3](/spec/trust-model/#623-rate-limiting-and-burst-detection).

**R.5 (MAY)** Relay nodes operate as feed generators, publishing curated subsets of the firehose under documented filtering criteria.

---

## Self-attestation

A conforming implementation publishes a self-attestation at a discoverable location (e.g., `https://<node-host>/.well-known/aegis-federation-conformance.json`) declaring:

- The conformance tier (1, 2, or 3)
- The implemented event types
- The supported feeds (consumed and/or published)
- The implementation name and version
- The DID of the operating node

Schema for the conformance attestation is provided as a Lexicon in the aegis-federation repository (private).

## Reference test vectors

Test vectors for each event type, with valid and invalid examples, are maintained in the aegis-federation repository (private) under `test-vectors/`. Implementations are encouraged to validate against these vectors as part of their CI.
