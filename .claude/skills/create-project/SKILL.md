---
name: create-project
description: Create a local project file. Use when the asked to create a project.
---

Create project within a local project file (docs/projects) around $ARGUMENTS.

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

#### Alternatives not chosen (optional)

- **{Alternative}** — Why it was not chosen.

#### Decisions (optional)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| {Decision} | {Choice} | {Rationale} |

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

## Post-Mortem

### Summary

High-level outcome: issues planned, PRs merged, follow-ups identified, and overall assessment.

### What Went Well

- What succeeded and why.

### What Went Wrong

What failed and why.

| Issue | Root Cause | Category |
|-------|-----------|----------|
| {Issue} | {Root Cause} | {Category} |

### Recommendations

Actionable improvements for future projects.

```

## Workflow

1. **Create a GitHub Milestone** matching the project title using `gh api`:
   ```bash
   gh api repos/{owner}/{repo}/milestones -f title="V{VERSION} {Initiative Name}"
   ```
   The milestone title must match the project title exactly (e.g., `V0.7 Project Workflow`).

2. **Create the project file** at `docs/projects/V{VERSION}-{INITIATIVE}.md` using the template above. Include the milestone URL in the `## References` section:
   ```markdown
   - [Milestone: V{VERSION} {Initiative Name}](https://github.com/{owner}/{repo}/milestone/{number})
   ```

3. ADRs and tasks are created during project execution, not pre-defined.

## Status Values

- **Draft**: Being defined, not yet approved
- **Active**: Approved and in progress
- **Done**: All exit criteria met
- **Paused**: Temporarily halted; note the reason
