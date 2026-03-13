# Skiploom

Skiploom is a recipe management system.

## Directory Structure

- `src/`: Source code, organized by tier (backend API, frontend UX).
- `docs/`: Documentation. Consult for operational procedures, architecture decisions, and project definitions. Check here before searching source code for operational or capability questions.
- `infra/`: Infrastructure initialization files.
- `scripts/`: Automation scripts for deployment, secrets management, and E2E testing.

## Information Routing

- **Operational questions** (service URLs, ports, admin consoles, deploy procedures): Consult `docs/RUNBOOK.md` before searching source code.
- **Architecture and capability questions** (domain model, system design, API style, feature details): Consult `docs/ENG-DESIGN.md` and `docs/adrs/` before searching source code.
- A negative source code search is not sufficient to assert something doesn't exist — consult authoritative documentation first.

## Source Control Standards

- **Working Branches**: All source controlled resource changes must take place in the context of a working branch.
  - `main` is the primary branch.
  - No changes are allowed against `main`.
- **Issue References**: Commits reference GitHub issues.
- **Pull Requests**: Pull-requests close GitHub issues.
- **PR Reviews**: All pull requests require at least one review before merge.
- **Title Accuracy**: Update issue and PR titles when the implementation approach diverges from the original plan.
- **Criteria Accuracy**: When acceptance criteria reference architectural layers or framework-specific placement, validate assumptions against actual framework constraints during implementation. Update criteria and note the reason if the correct approach differs.
- **Deliverable Ownership**: Avoid modifying deliverables owned by another issue's PR. Defer changes to the owning PR or create a follow-up commit on the owning branch.
- **Commit Scope**: All commits in a PR must relate to the associated issue. Process or tooling improvements discovered during implementation should be tracked as separate issues and committed on their own branches.

## Command Style

- **compound commands are strictly prohibited**: Compound commands require manual input because they cannot be evaluated using the `settings.local.json` file.
  - Issue each command as a separate Bash tool call.

## Development Standards

- **Principle of Least Astonishment**: System should be implemented and behave in commonly expected ways.
- **You aren't going to need it (YAGNI) Principle**: Don't build functionality until it's needed.
- **Test-Driven Development (TDD)**: Code changes follow TDD, but if no code changes, then no tests.
  - All tests must pass prior to committing changes.
- See `src/CLAUDE.md` for source development standards.

## Testing

- See `src/CLAUDE.md` for testing instructions.
- New features that affect user-facing behavior require E2E tests (see `src/frontend/CLAUDE.md`).
- Run E2E tests locally before committing: `bash scripts/run-e2e.sh --development`
