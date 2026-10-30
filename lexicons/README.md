# AEGIS Governance Federation — Lexicon Schemas

This directory contains the AT Protocol [Lexicon](https://atproto.com/specs/lexicon) schemas that define the governance
record types used across the AEGIS Governance Federation Network.

## What are Lexicons?

Lexicons are AT Protocol's schema definition language. They define the structure of records, queries, and procedures in
the AT Protocol network. Each Lexicon has a reverse-DNS identifier (NSID) and specifies the shape of data that can be
stored in a user's repository on their Personal Data Server (PDS).

Lexicons use a JSON-based schema format with version `"lexicon": 1`. Each schema defines:

- **Record types** — Data structures stored in AT Protocol repositories
- **Queries** — Read-only XRPC endpoints
- **Procedures** — Write XRPC endpoints

## Governance Schemas

All AEGIS governance schemas use the `com.aegisfederation.governance.*` namespace. Each schema is one
record per [GFN-1 registered `event_type`](https://aegis-federation.com/spec/schema/#3-event-types-registry),
realigned to the spec in [RFC-0009](https://aegis-federation.com/rfc/0009/) (Final). Every record shares
the same envelope shape (matching [Schema §2](https://aegis-federation.com/spec/schema/#2-aegis-event-envelope-required))
wrapping an event-specific `payload`. Field names are **snake_case**, matching the spec exactly — a
deliberate divergence from AT Protocol's usual camelCase convention; see RFC-0009's Design Decisions
for the rationale.

**Envelope fields, present on every record:**

- `event_id`, `timestamp`, `publisher_did`, `event_type`, `payload`, `signature` (required)
- `schema_version`, `correlation_id`, `references`, `tags`, `visibility`, `ttl_seconds` (optional)

### `circumventionReport` — Circumvention Report

**NSID**: `com.aegisfederation.governance.circumventionReport`\
**`event_type`**: `governance.circumvention_report.v1`

A technique observed or validated that attempts to bypass governance controls.

**Payload required fields**: `technique_id`, `category`, `severity`, `description`, `observed_at`

**Severity**: `low` | `medium` | `high` | `critical` (enum)

### `riskSignal` — Risk Signal

**NSID**: `com.aegisfederation.governance.riskSignal`\
**`event_type`**: `governance.risk_signal.v1`

Aggregated telemetry describing emerging governance risk.

**Payload required fields**: `risk_category`, `severity`, `trend`, `scope`, `summary`

**Severity**: `advisory` | `warning` | `critical` (enum). **Trend**: `rising` | `stable` | `declining` (enum)

### `policyUpdate` — Policy Update

**NSID**: `com.aegisfederation.governance.policyUpdate`\
**`event_type`**: `governance.policy_update.v1`

Publishes a governance policy document, profile, or delta.

**Payload required fields**: `policy_id`, `policy_version`, `policy_authority_did`, `effective_date`,
`change_summary`, `policy_uri`

### `attestation` — Governance Attestation

**NSID**: `com.aegisfederation.governance.attestation`\
**`event_type`**: `governance.attestation.v1`

Declares governance posture and enables inter-node trust decisions. Capability/control declarations
(the retired `capability` record's concept) are carried here via `controls_implemented` and
`compliance_profiles` rather than as a separate record type — GFN-1 does not register a
capability-declaration event type.

**Payload required fields**: `aegis_version`, `risk_model_id`, `compliance_profiles`, `attested_at`,
`attesting_did`

**Assurance level**: `self` | `internal` | `external` (enum)

### `incidentNotice` — Incident Notice

**NSID**: `com.aegisfederation.governance.incidentNotice`\
**`event_type`**: `governance.incident_notice.v1`

Discloses a governance failure or safety incident to improve ecosystem resilience.

**Payload required fields**: `incident_id`, `incident_class`, `severity`, `occurred_at`, `summary`

**Severity**: `low` | `medium` | `high` | `critical` (enum)

## A note on `confidence` fields

The GFN-1 spec defines `confidence` as a `number 0..1` float on several payloads. AT Protocol Lexicon v1
has no floating-point primitive type (only `integer`, `string`, `boolean`, `array`, `unknown`, `bytes`,
`cid-link`, `ref`/`union`, `blob`). These lexicons represent `confidence` as an integer percentage
(0-100); divide/multiply by 100 when translating to/from the canonical GFN-1 envelope. See RFC-0009
Design Decision 5.

## Directory Structure

```
lexicons/
└── com/
    └── aegisfederation/
        └── governance/
            ├── circumventionReport.json
            ├── riskSignal.json
            ├── policyUpdate.json
            ├── attestation.json
            └── incidentNotice.json
```

This follows the AT Protocol convention of mapping NSIDs to directory paths.

## Validation

`validate.mjs` validates every schema in this directory against `@atproto/lexicon`'s real `lexiconDoc`
zod schema (not the `Lexicons` class's `.add()`, which performs no validation at all — see the comment
at the top of the script). Run with `npm install && npm run validate`. Wired into CI via
[`.github/workflows/lexicon-validate.yml`](../.github/workflows/lexicon-validate.yml).

Valid/invalid record examples for each schema live in [`../test-vectors/`](../test-vectors/).

## Usage

These schemas are consumed by:

- **Feed Generator** (`/feed-generator`) — Filters the AT Protocol firehose for matching records
  (firehose connection not yet implemented — tracked in [#1](https://github.com/aegis-initiative/aegis-federation/issues/1))
- **AEGIS Core** — Validates governance records before publishing
- **AEGIS Platform** — Publishes governance signals using these schemas
- **Federation Participants** — Subscribe to and validate incoming governance records

## References

- [AT Protocol Lexicon Specification](https://atproto.com/specs/lexicon)
- [AT Protocol Record Types](https://atproto.com/specs/record-key)
- [GFN-1 Event Schemas](https://aegis-federation.com/spec/schema/) — the normative spec these lexicons implement
- [RFC-0009](https://aegis-federation.com/rfc/0009/) — the realignment this directory reflects
- [AEGIS Governance Architecture](../docs/README.md)
