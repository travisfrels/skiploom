Work the task specified by $ARGUMENTS.

## Setup

1. Read the task file at `docs/tasks/$ARGUMENTS`.
2. Read all documents listed in the task's References section.
3. Read `docs/tasks/CLAUDE.md` for task conventions.
4. Create and checkout a working branch named `task/{slug}` from `main`, where `{slug}` is a short lowercase-hyphenated summary of the task title (e.g., `task/operational-persistence`).

## Execution

1. Update the task file: set Status to `In Progress` and update the Updated date.
2. Update `docs/tasks/INDEX.md` to reflect the status change.
3. Work through the in-scope items, guided by the implementation notes and acceptance criteria.
4. After completing each meaningful milestone (a scope item finished, a group of related files created, tests passing), append a succinct progress entry to the task file's Progress Log section:
   ```
   - {YYYY-MM-DD} {brief description of what was completed}
   ```
5. When all acceptance criteria are met, set Status to `Done` and update the Updated date and INDEX.md.
6. If you encounter a blocker, set Status to `Blocked`, note the reason in the Progress Log, and stop.

## Constraints

- Do not modify files outside the task's stated scope.
- Do not mark acceptance criteria as checked until they are verified (tests pass, application starts, etc.).
- Keep progress log entries to one line each.
- Commit work incrementally with descriptive messages.
