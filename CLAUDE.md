# Skiploom

Skiploom is a recipe management system.

## Directory Structure

- `src/`: Source Code
- `docs/`: Documentation
- `infra/`: Infrastructure Initialization Files
- `scripts/`: Scripts for automation and tooling
- `.env`: Environment Specific Variables

## Source Control Standards

- **Working Branches**: All source controlled resource changes must take place in the context of a working branch.
  - `main` is the primary branch.
  - No changes are allowed against `main`.
- **Issue References**: Commits reference Forgejo issues.
- **Pull Requests**: Pull-requests close Forgejo issues.

## Development Standards

- **Test-Driven Development**: Code changes follow TDD, but if no code changes, then no tests.
  - All tests must pass prior to committing changes.
- **SOLID Principles**: Implemented code follows SOLID principles

## Forgejo For Issues and Pull Requests

- To interact with ForegeJo use `scripts/forgejo.sh` exclusively
