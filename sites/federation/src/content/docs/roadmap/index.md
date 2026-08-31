---
title: "Roadmap"
description: "Future RFCs and planned extensions to the AEGIS Federation specification"
---

# Roadmap

GFN-1 v1.0 is normative and stable, but the specification is not finished. This page documents the planned extensions and the RFCs that will deliver them. Each extension goes through the [RFC process](/rfc/) before becoming normative.

The roadmap is **non-normative**. Implementations need not anticipate any of these items.

---

## Near-term (next 6 months)

### AI-Operational Signal Types

The current GFN-1 schema set focuses on **governance reporting** signals: circumvention reports, risk signals, policy updates, attestations, and incident notices. These are the right starting set for compliance and posture-sharing use cases. They do not yet cover the operational signals that AI platform operators are increasingly seeking to share.

Planned RFCs to extend the schema set:

| Proposed RFC | Topic | Why |
|---|---|---|
| **Drift Event** | `governance.drift_event.v1` | Model behavior change over time — eval-score drift, response-distribution shifts, capability emergence. Signals when a deployed model is no longer behaving like its baseline. |
| **Evaluation Result** | `governance.evaluation_result.v1` | Red-team / benchmark / capability eval results in a portable form. Enables cross-org comparison without leaking eval prompts. |
| **Behavioral Observation** | `governance.behavioral_observation.v1` | Specific in-the-wild observations of model behavior: jailbreak attempts (with redacted indicators), alignment failures, capability misuse. |
| **Configuration Attestation** | `governance.configuration_attestation.v1` | Declared guardrails, active policy enforcement state, runtime constraints. Distinct from §7 governance attestations (which are higher-level posture statements). |

These are tracked as planned RFCs in the federation RFC series. Numbering will be assigned when drafts are opened.

### A2A Integration

[A2A (Agent-to-Agent)](https://a2aprotocol.ai/) is an emerging wire format for direct agent-to-agent communication. The GFN currently uses AT Protocol records for *broadcast* signal distribution. A2A would complement this with **direct queries** about federation state — e.g., "does node X currently have attestation Y in effect?" or "what is the active policy version for governance authority Z?"

Planned RFC: **A2A Integration for Federation State Queries** — defines a query interface that agents can use to interrogate federation state without subscribing to feeds.

A2A integration is intentionally optional. Conforming GFN-1 implementations need not support A2A; conformance with A2A would be an additive Tier 4 in the conformance hierarchy.

### MCP Integration

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is Anthropic's specification for exposing tools and context to LLMs. A GFN-MCP binding would let governance signals be consumed directly by LLM-based agents as context.

Planned RFC: **MCP Bindings for Governance Signals** — defines how a GFN node exposes feeds via an MCP server interface so LLM agents can query and reason over governance state.

---

## Medium-term (6–18 months)

### Reputation Graph Protocol

GFN-1's trust model includes optional typed-trust and audit-chain extensions ([Trust Model §9](/spec/trust-model/#9-reputation-graph-extensions)) but does not specify how reputation graph data is *exchanged* between nodes. A reputation graph protocol would enable federated reputation propagation while preserving node autonomy.

### Schema Registry Federation

GFN-1 assumes a single canonical schema registry. As the spec evolves and as third-party vocabularies emerge, the network may benefit from a federated schema registry: a way for AEGIS Initiative, NIST, EU AI Office, and other authorities to publish their own vocabulary extensions discoverable through the federation itself.

### Zero-Knowledge Governance Attestations

Some governance attestations contain sensitive evidence that publishers cannot disclose. A zero-knowledge variant of the attestation envelope would allow proof of properties (e.g., "we passed external audit X") without revealing the underlying evidence. This is research-stage work; standardization depends on the underlying ZK primitives maturing.

---

## Long-term (18+ months)

### Stewardship Transition

The specification is currently stewarded by AEGIS Initiative. Long-term, transition to a multi-stakeholder body (analogous to OASIS for STIX or the W3C for ActivityPub) is appropriate if and when ecosystem adoption justifies it. The transition will be proposed as an RFC with explicit transfer terms.

### Network Versioning

GFN-1 is the first stable specification version. A future GFN-2 may introduce breaking changes (new envelope fields, modified trust model, etc.). The transition mechanism — including how nodes negotiate version compatibility on the wire — will be specified in advance via RFC.

---

## Out of scope (deliberately)

The roadmap explicitly does not include:

- **Centralized governance authority.** No matter how the network grows, no party will gain unilateral control over participation or signal validity.
- **Mandatory enforcement of any specific policy.** The GFN distributes signals; it does not enforce policies. Local-policy autonomy is non-negotiable.
- **Wire-level transport innovation.** Federation will continue to leverage AT Protocol. New wire protocols are out of scope unless AT Protocol is deprecated.
- **Content moderation.** Trust-based downweighting handles low-quality publishers; the GFN does not police what publishers may say.

---

## Contributing

If you have a topic that should appear on this roadmap, open a draft RFC against the [aegis-federation repository](https://github.com/aegis-initiative/aegis-federation/blob/main/rfc/). The RFC need not be complete to start the conversation — the [RFC process](/rfc/) explicitly supports placeholder RFCs to reserve a number and document intent.
