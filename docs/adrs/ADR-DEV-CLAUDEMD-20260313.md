# ADR: Directive-First CLAUDE.md Authoring Convention

## Status

Accepted

## Context

CLAUDE.md files across the Skiploom repository serve as navigational guidance for Claude sessions that lack memory of prior sessions. Sessions rely on these files to understand *where to look* for information and *what action to take* given a type of question.

The majority of CLAUDE.md directory structure entries used passive, descriptive labels — cataloging what a resource *is* rather than directing when to *use* it. For example:

- Root `CLAUDE.md` listed `docs/` as "Documentation" with no indication of what kinds of questions the docs answer.
- `docs/CLAUDE.md` listed `RUNBOOK.md` as "Operational procedures" — accurate but passive.

This caused a concrete incident: when asked for the staging feature flag URL, a session searched the frontend source code, found no feature flag management route, and concluded no admin UI exists. The answer was in `docs/RUNBOOK.md` (the Togglz admin console is served by the backend), but the passive description "Operational procedures" did not trigger consultation. The session then searched through API controllers, route definitions, and 50+ files before being directed to the runbook.

Two compounding problems existed:

1. **No directive routing to authoritative sources.** Sessions defaulted to source code search because directory entries did not indicate which resources answer which types of questions.
2. **No convention against asserting non-existence from partial search.** The system has multiple layers (frontend SPA, backend web framework, infrastructure). A negative result from searching one layer is insufficient to conclude something doesn't exist — especially when authoritative documentation hasn't been consulted.

No governing standard existed for how CLAUDE.md content should be written. The same sessions that wrote the passive content would continue writing it without an established convention.

Three alternatives were evaluated:

1. **Directive-first with routing rules** — Extend the existing "See X for Y" pattern to all directory structure entries where a routing decision exists. Codify the convention in an ADR.
2. **Descriptive catalog with separate routing section** — Keep directory entries as passive descriptions. Add a separate "Routing" section to each CLAUDE.md.
3. **Inline fixes only (no ADR)** — Update passive entries without creating a formal convention.

## Decision

We will adopt a **directive-first authoring convention** for all CLAUDE.md directory structure entries where a behavioral routing decision exists, codified in this ADR.

## Rationale

Directive-first was selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | Directive-first | Separate routing section | Inline fixes, no ADR |
|-----------|----------------|------------------------|---------------------|
| Impact | High | Medium | Low |
| Least Astonishment | High | Medium | Medium |
| Idiomaticity | High | Low | Low |

**Why not separate routing section?**

Routing guidance separated from directory entries creates two places to maintain and two places to scan. Sessions read directory structure sections first and act on them. The observed incident happened because the session scanned the directory listing and acted on it — putting routing elsewhere does not fix this. No precedent exists in the codebase for a "Routing" section.

**Why not inline fixes only?**

Fixes the immediate files but provides no convention for future authoring. The 42+ CLAUDE.md files are authored and maintained by Claude sessions. Without a discoverable convention, the same passive patterns will recur. System-wide conventions in this codebase are tracked as ADRs.

## Design

### Convention Rules

**Rule 1: Directive over descriptive for routing entries.**

Directory structure entries where a session must choose *which resource to consult* for a given type of question must include directive guidance: what types of questions the resource answers and when to consult it.

*Directive example:*
```
- `docs/`: Documentation. Consult for operational procedures, architecture decisions, and project definitions. Check here before searching source code for operational or capability questions.
```

*Passive example (before):*
```
- `docs/`: Documentation
```

**Rule 2: Self-explanatory entries are left as-is.**

Entries where file or directory names are self-explanatory and no routing decision exists do not need directive guidance. These are entries where the name alone tells a session everything it needs to know, and there is no behavioral choice between consulting this resource vs. another.

*Self-explanatory example (no change needed):*
```
- `postgres/`: Postgres infrastructure files.
```

**Rule 3: Authoritative sources before source code.**

For operational questions (service URLs, ports, admin consoles, deploy procedures), consult `docs/RUNBOOK.md` before searching source code. For system capability and architectural questions, consult `docs/ENG-DESIGN.md` and `docs/adrs/` before searching source code. A negative source code search is not sufficient to assert something doesn't exist when authoritative documentation has not been consulted.

**Rule 4: No duplication with existing directives.**

When a CLAUDE.md file already contains a directive entry elsewhere (e.g., "See `src/CLAUDE.md` for source development standards"), the directory structure entry for the same resource should complement, not repeat, that directive. The existing directive remains authoritative.

### Validation

When authoring or reviewing a CLAUDE.md directory structure entry, apply this checklist:

1. Does a routing decision exist for this entry? (If no → leave as-is per Rule 2)
2. Does the entry tell a session *when* to consult the resource and *what questions* it answers? (If no → add directive per Rule 1)
3. Does an existing directive elsewhere in the file already cover this resource? (If yes → ensure no duplication or contradiction per Rule 4)

## Consequences

**Positive:**

- Sessions receive routing guidance at the point of scanning, reducing reliance on source code search for operational and capability questions
- Convention is discoverable by future sessions through the ADR, preventing recurrence of passive authoring patterns
- Validation checklist provides a concrete mechanism for reviewing new CLAUDE.md content

**Negative:**

- Directory structure entries become longer — entries that were single-word descriptions now include sentences of directive guidance
- Maintenance burden increases: when resources change purpose, both the resource and its CLAUDE.md directive must be updated

**Neutral:**

- Entries that are genuinely self-explanatory remain unchanged — the convention explicitly scopes itself to entries where a routing decision exists
- The convention applies to all 42+ existing CLAUDE.md files but only requires changes to files with directory structure sections containing routing decisions (~9 files)
