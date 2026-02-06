# Skiploom Tasks

Task definitions for implementation work.

## Task Template

Tasks in this directory use the filename format `TASK-{TIMESTAMP}.md` where `{TIMESTAMP}` is `YYYYMMDD`. Use the following template:

```markdown
# Task: {Title}

| Status | Created | Updated |
|--------|---------|---------|
| {Status} | {YYYY-MM-DD} | {YYYY-MM-DD} |

## Objective

Brief statement of what this task accomplishes and why.

## References

- Links to ADRs, eng design sections, or other tasks that inform this work.

## Scope

### In Scope

- Specific deliverables and changes.

### Out of Scope

- Explicitly excluded work to prevent scope creep.

## Acceptance Criteria

- [ ] Verifiable conditions that define "done".

## Implementation Notes

Optional guidance on approach, sequencing, or constraints.

## Progress Log

- {YYYY-MM-DD} {succinct description of what was completed}
```

## Conventions

### Branch Naming

Tasks are worked in a branch named `task/{slug}`, where `{slug}` is a short lowercase-hyphenated summary of the task title (e.g., `task/operational-persistence`). Branches are created from `main`.

### Task Index

`docs/tasks/INDEX.md` lists all tasks grouped by status. Update it whenever a task's status changes.

### Progress Log

Append one-line entries to the task's Progress Log section after each meaningful milestone. Keep entries succinct.

## Status Values

- **Open**: Not started
- **In Progress**: Actively being worked
- **Done**: All acceptance criteria met
- **Blocked**: Cannot proceed; note the reason
