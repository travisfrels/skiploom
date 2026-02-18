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

## Development Standards

- **Test-Driven Development**: Code changes follow TDD, but if no code changes, then no tests.
  - All tests must pass prior to committing changes.
  - See `src/CLAUDE.md` for testing instructions.
- **SOLID Principles**: Implemented code follows SOLID principles
