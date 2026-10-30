# test-vectors/

Valid and invalid record examples for each GFN-1 event type, referenced from
[`/spec/conformance/`](https://aegis-federation.com/spec/conformance/)
("Reference test vectors"). Implementations are encouraged to validate
against these as part of their own CI.

## Structure

One directory per event type, matching the lexicon in
[`../lexicons/com/aegisfederation/governance/`](../lexicons/com/aegisfederation/governance/):

| Directory | Lexicon | `event_type` |
|---|---|---|
| `circumvention-report/` | `circumventionReport.json` | `governance.circumvention_report.v1` |
| `risk-signal/` | `riskSignal.json` | `governance.risk_signal.v1` |
| `policy-update/` | `policyUpdate.json` | `governance.policy_update.v1` |
| `attestation/` | `attestation.json` | `governance.attestation.v1` |
| `incident-notice/` | `incidentNotice.json` | `governance.incident_notice.v1` |

Within each directory, filenames declare the expectation: `valid-*.json`
must pass validation, `invalid-*.json` must fail. `validate.mjs` enforces
both directions -- a vector that's supposed to be invalid but silently
passes is itself a test failure, not a pass.

## Running

```
npm install
npm run validate
```

Wired into CI via
[`.github/workflows/lexicon-validate.yml`](../.github/workflows/lexicon-validate.yml)
on any push/PR touching `test-vectors/**` or `lexicons/**`.
