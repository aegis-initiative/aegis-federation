---
title: "Glossary"
description: "Glossary of terms used in the AEGIS Federation specification"
sidebar:
  order: 4
---

# Glossary

Terms used throughout the GFN-1 specification. Where a term has a specific normative meaning, it is marked **(normative)**.

---

## A

**AEGIS Initiative** — the originating organization for the GFN-1 specification. Operates the reference network at `aegis-federation.com`.

**AEGIS Node** — a system that publishes or consumes governance signals on the federation. **(normative)**

**AT Protocol (atproto)** — the federation infrastructure underlying the GFN: provides DIDs, repositories, signed records, the firehose, and relay topology. See [atproto.com](https://atproto.com).

**Attestation** — a signed declaration of governance posture by a node about itself or another node. See [`governance.attestation.v1`](/spec/schema/#7-governance-attestation).

**Audit log** — append-only, tamper-evident record of all federation events received, all trust decisions made, and all policy decisions issued. **(normative)**

**Authority class** — the publisher classification (`L0_SYSTEM`, `L1_AUTHORITY`, `L2_ENTERPRISE`, `L3_CONTRIBUTOR`, `UNCLASSIFIED`, `QUARANTINE`) that determines initial trust score and ingestion policy. **(normative)** See [Trust Model §2.2](/spec/trust-model/#22-authority-classification-scheme-normative).

## C

**Circumvention report** — a federation event documenting an observed or validated technique for bypassing governance controls. See [`governance.circumvention_report.v1`](/spec/schema/#4-circumvention-report).

**Conformance** — the set of normative requirements (MUST / SHOULD / MAY) a GFN-compliant implementation satisfies. See [Conformance](/spec/conformance/).

**Consortium** — a group of nodes with shared bootstrap trust, established via a Trust Bootstrap Method. See [Trust Model §5.3](/spec/trust-model/#53-bootstrap-method-2-consortium-membership-medium-assurance).

**Corroboration** — independent confirmation of a signal's claim by additional publishers, used to weight events upward. **(normative)** See [Trust Model §4.3](/spec/trust-model/#43-corroboration-boost-normative).

## D

**DID (Decentralized Identifier)** — the cryptographically verifiable identity format used by all federation participants. Format: `did:aegis:<network>:<node-identifier>`. **(normative)**

**DID document** — the resolvable record describing a DID's public keys, services, and metadata.

## E

**Envelope** — the canonical wrapper for all federation events. Contains identity, timestamp, type, payload, and signature. See [Schema §2](/spec/schema/#2-aegis-event-envelope-required). **(normative)**

**Event** — a single federation message. Always consists of an envelope and a payload conforming to the envelope's declared event_type.

**Event ID** — globally unique identifier for an event, used for replay protection. UUID format recommended. **(normative)**

**Event type** — the registered identifier (e.g., `governance.risk_signal.v1`) declaring the schema of an event's payload. **(normative)**

## F

**Federation** — the operational state of multiple independent AEGIS nodes exchanging signals through AT Protocol. Distinct from "the federation network" (the union of all participating nodes).

**Feed** — a named channel that publishes a category of governance signals. Feeds use a dot-separated namespace (e.g., `governance.risk.public`). See [Feed Taxonomy](/spec/feeds/).

**Feed generator** — a service that subscribes to the AT Protocol firehose, filters for signals matching feed criteria, and publishes the curated stream as a feed.

**Firehose** — AT Protocol's stream of all repository commits across the network.

## G

**Governance signal** — generic term for any GFN federation event. Includes circumvention reports, risk signals, policy updates, attestations, and incident notices.

**GFN** — AEGIS Governance Federation Network. The system specified by this site. **(normative)**

**GFN-1** — version 1 of the GFN specification, the current authoritative version. **(normative)**

## I

**Incident notice** — a federation event disclosing a governance failure or safety incident. See [`governance.incident_notice.v1`](/spec/schema/#8-incident-notice).

**Ingestion** — a node's process of receiving an event, verifying it, and applying its information (or quarantining it). **(normative)**

## L

**Lexicon** — AT Protocol's schema definition format. The GFN uses Lexicons to define machine-readable schemas for event types.

## N

**Node** — see *AEGIS Node*.

## P

**PDS (Personal Data Server)** — an AT Protocol component that stores a participant's signed records and serves them to the federation.

**Policy authority** — a trusted node that publishes normative governance frameworks (e.g., NIST profiles, EU AI Act profiles). Policy authorities have no special control over the network; they are trusted publishers, not gatekeepers. **(normative)**

**Policy update** — a federation event publishing a new policy, an amendment, or a deprecation. See [`governance.policy_update.v1`](/spec/schema/#6-policy-update).

**Publisher** — the originating node of an event, identified by its DID.

## Q

**Quarantine** — the state of a publisher whose trust score has collapsed below the operational threshold. Events from quarantined publishers are rejected. **(normative)**

## R

**Receiver** — a node consuming an event published by another node.

**Relay** — an AT Protocol component that aggregates and rebroadcasts repository commits, forming the firehose.

**Replay protection** — mechanisms ensuring an event cannot be re-injected to repeat its effect. The GFN combines unique `event_id`, timestamp window, and replay-cache TTL. **(normative)** See [Trust Model §2.1](/spec/trust-model/#21-identity-verification-mandatory).

**RFC** — Request for Comments. The mechanism for proposing, discussing, and ratifying changes to the GFN specification. See [RFCs](/rfc/).

**Risk signal** — a federation event reporting aggregated telemetry about emerging governance risk. See [`governance.risk_signal.v1`](/spec/schema/#5-risk-signal).

## S

**Sybil attack** — an attack in which an attacker creates multiple pseudo-identities to amplify signals or bypass rate limits. The GFN trust model includes specific Sybil-resistance mechanisms. See [Trust Model §6](/spec/trust-model/#6-sybil-attack-resistance).

**Signature** — a cryptographic signature over the canonicalized event envelope. Required on every event. **(normative)**

## T

**Trust score** — a node's locally computed credibility rating for a publisher, in the range `[0.0, 1.0]`. See [Trust Model §3](/spec/trust-model/#3-normative-trust-score-calculation). **(normative)**

**Trust anchor** — a publisher whose initial trust is bootstrapped via a method that does not depend on observed history (e.g., allowlisted DIDs, consortium membership proof). See [Trust Model §5](/spec/trust-model/#5-trust-bootstrap-mechanisms).

**Trust evaluator** — the node component that assigns trust scores to publishers and weights to events.

## V

**Visibility** — the disclosure scope of an event payload: `public`, `restricted`, or `private`. Visibility hints to receivers but does not enforce access (cryptographic access control happens at the transport layer).
