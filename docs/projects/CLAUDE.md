# Skiploom Projects

Product initiative definitions (a.k.a. Projects).

## Project Template

Projects use the filename format `V{VERSION}-{INITIATIVE}.md` (e.g., `V1_0-MVP.md`, `V2_0-MEAL-PLANNING.md`). Use the following template:

```markdown
# {Version} {Initiative Name}

| Status | Created | Updated |
|--------|---------|---------|
| {Status} | {YYYY-MM-DD} | {YYYY-MM-DD} |

## Context

### Situation

What is the current state?

### Opportunity

What's wrong with it, or what could be better?

### Approach

What can we do about it?

## Goals

- What this project achieves.

## Non-Goals

- What this project explicitly does not attempt.

## Exit Criteria

- [ ] Verifiable conditions that define "done".

For infrastructure or workflow projects, include at least one criterion that exercises the
integrated system end-to-end (e.g., "Pipeline deploys to staging and serves traffic").
Component-level criteria alone verify parts in isolation but not that the system functions
as a whole.

## References

- Links to the issues that were planned as part of this project's original scope.

### Follow-Up Issues

- Links to issues discovered during execution that were not part of the original design.
- These represent gaps in the original plan and feed into the project post-mortem.

### Pull Requests

- Links to all PRs created during the project, in chronological order.

### Design References

- Links to web-based articles used in the design of the project.

```

ADRs and tasks are created during project execution, not pre-defined.

## Status Values

- **Draft**: Being defined, not yet approved
- **Active**: Approved and in progress
- **Done**: All exit criteria met
- **Paused**: Temporarily halted; note the reason
