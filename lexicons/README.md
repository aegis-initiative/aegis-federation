# AEGIS Governance Federation — Lexicon Schemas

This directory contains the AT Protocol [Lexicon](https://atproto.com/specs/lexicon) schemas that define the governance record types used across the AEGIS Governance Federation Network.

## What are Lexicons?

Lexicons are AT Protocol's schema definition language. They define the structure of records, queries, and procedures in the AT Protocol network. Each Lexicon has a reverse-DNS identifier (NSID) and specifies the shape of data that can be stored in a user's repository on their Personal Data Server (PDS).

Lexicons use a JSON-based schema format with version `"lexicon": 1`. Each schema defines:
- **Record types** — Data structures stored in AT Protocol repositories
- **Queries** — Read-only XRPC endpoints
- **Procedures** — Write XRPC endpoints

## Governance Schemas

All AEGIS governance schemas use the `com.aegisfederation.governance.*` namespace.

### `signal` — Governance Intelligence Signal

**NSID**: `com.aegisfederation.governance.signal`

A governance intelligence signal shared across the federation. Signals represent real-time governance events such as circumvention attempts, risk alerts, policy violations, anomalies, and advisories.

**Required fields**: `type`, `severity`, `summary`, `createdAt`

**Signal types**: `circumvention`, `risk_alert`, `policy_violation`, `anomaly`, `advisory`

**Severity levels**: `critical`, `high`, `medium`, `low`, `informational`

---

### `attestation` — Compliance Attestation

**NSID**: `com.aegisfederation.governance.attestation`

A governance compliance attestation for an AEGIS-governed entity. Attestations are cryptographically signed statements that an entity has been verified to comply with a specific governance capability set.

**Required fields**: `entityDid`, `capabilitySetId`, `governanceVersion`, `attestedBy`, `validFrom`, `createdAt`

---

### `capability` — Capability Set Declaration

**NSID**: `com.aegisfederation.governance.capability`

A declared capability set for AEGIS-governed entities. Capability sets define the permissions and constraints for AI systems operating under AEGIS governance.

**Required fields**: `name`, `version`, `capabilities`, `denyByDefault`, `createdAt`

**Risk levels**: `low`, `medium`, `high`, `critical`

---

### `incident` — Governance Incident Notification

**NSID**: `com.aegisfederation.governance.incident`

A governance incident notification with timeline tracking. Incidents represent governance failures or breaches that require coordinated response across the federation.

**Required fields**: `incidentId`, `severity`, `summary`, `status`, `createdAt`

**Status values**: `open`, `investigating`, `mitigated`, `resolved`

---

### `policy` — Policy Update

**NSID**: `com.aegisfederation.governance.policy`

A governance policy update published to the federation. Policy records announce new governance policies, amendments to existing policies, or policy deprecations.

**Required fields**: `policyId`, `version`, `changeType`, `summary`, `effectiveDate`, `createdAt`

**Change types**: `new`, `amendment`, `deprecation`

## Directory Structure

```
lexicons/
└── com/
    └── aegisfederation/
        └── governance/
            ├── signal.json
            ├── attestation.json
            ├── capability.json
            ├── incident.json
            └── policy.json
```

This follows the AT Protocol convention of mapping NSIDs to directory paths.

## Usage

These schemas are consumed by:
- **Feed Generator** (`/feed-generator`) — Filters the AT Protocol firehose for matching records
- **AEGIS Core** — Validates governance records before publishing
- **AEGIS Platform** — Publishes governance signals using these schemas
- **Federation Participants** — Subscribe to and validate incoming governance records

## References

- [AT Protocol Lexicon Specification](https://atproto.com/specs/lexicon)
- [AT Protocol Record Types](https://atproto.com/specs/record-key)
- [AEGIS Governance Architecture](../docs/README.md)
