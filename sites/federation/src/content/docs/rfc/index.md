---
title: "Request for Comments"
description: "AEGIS Federation RFC series"
---

# AEGIS Federation RFCs

The RFC series documents proposed and ratified changes to the AEGIS Federation specification. Each RFC addresses a specific aspect of the system; the RFC index is the canonical place to find work-in-progress and final design decisions.

RFC numbering and process are aligned with the broader AEGIS RFC series originated in [aegis-governance](https://aegis-governance.com/rfc/). RFCs primarily concerning federation are tracked here; RFCs concerning the wider AEGIS architecture remain in their original repository.

---

## Federation RFCs

| RFC | Title | Version | Status |
|---|---|---|---|
| [RFC-0004](/rfc/0004/) | AEGIS Governance Event Model | 1.0 | Final |
| [RFC-0008](/rfc/0008/) | Federation Network Transport | 0.0.1 | Placeholder |
| [RFC-0009](/rfc/0009/) | Lexicon Alignment with GFN-1 Schema | 0.0.1 | Placeholder (high priority) |

---

## Process

The AEGIS Federation specification evolves through the RFC process:

1. **Draft** — A proposed change is written as an RFC with a problem statement, design, and acceptance criteria. Drafts are submitted as PRs to the [aegis-federation repository](https://github.com/aegis-initiative/aegis-federation).
2. **Discussion** — Drafts are open for public comment for a minimum of 14 days.
3. **Ratification** — Once consensus is reached among active implementers, the RFC is marked Final and the affected specification documents are updated in the same PR.
4. **Frozen** — Final RFCs are frozen at a specific version. Subsequent changes require a new RFC that supersedes the prior one.

A *Placeholder* RFC reserves an RFC number for a topic that is anticipated but not yet drafted. Placeholders link to the planned topics on the [Roadmap](/roadmap/).

---

## Status definitions

| Status | Meaning |
|---|---|
| **Placeholder** | RFC number reserved; content forthcoming. No normative effect. |
| **Draft** | Public discussion open. May change substantially before ratification. |
| **Final** | Ratified. Changes require a superseding RFC. |
| **Superseded** | Replaced by a newer RFC; retained for historical reference. |

---

## Numbering

RFCs use a four-digit sequential number. Numbers are reserved when a placeholder is published; gaps in numbering are intentional and reflect RFCs that live in other AEGIS repositories.

| Range | Domain |
|---|---|
| 0001–0003 | Core architecture (in [aegis-governance](https://aegis-governance.com/rfc/)) |
| 0004 | Governance event model — relevant to federation, mirrored here |
| 0005–0007 | Other AEGIS topics (in aegis-governance) |
| 0008 | Federation network transport — federation-specific |
| 0009+ | Mixed; federation-specific RFCs are mirrored here |
