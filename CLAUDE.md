# Skiploom

Skiploom is a recipe management system.

## Directory Structure

- `src/`: Source Code
- `docs/`: Documentation
- `infra/`: Infrastructure Initialization Files
- `scripts/`: Scripts for automation and tooling

## Source Control Standards

- **Working Branches**: All source controlled resource changes must take place in the context of a working branch.
  - `main` is the primary branch.
  - No changes are allowed against `main`.
- **Issue References**: Commits reference GitHub issues.
- **Pull Requests**: Pull-requests close GitHub issues.
- **Title Accuracy**: Update issue and PR titles when the implementation approach diverges from the original plan.
- **Criteria Accuracy**: When acceptance criteria reference architectural layers or framework-specific placement, validate assumptions against actual framework constraints during implementation. Update criteria and note the reason if the correct approach differs.
- **Deliverable Ownership**: Avoid modifying deliverables owned by another issue's PR. Defer changes to the owning PR or create a follow-up commit on the owning branch.

## Development Standards

- **Principle of Least Astonishment**: System should be implemented and behave in commonly expected ways.
- **You aren't going to need it (YAGNI) Principle**: Don't build functionality until it's needed.
- **Test-Driven Development (TDD)**: Code changes follow TDD, but if no code changes, then no tests.
  - All tests must pass prior to committing changes.
- See `src/CLAUDE.md` for source development standards.

## Testing

- See `src/CLAUDE.md` for testing instructions.
- New features that affect user-facing behavior require E2E tests (see `src/frontend/CLAUDE.md`).
