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
  - `main` is the primary branch. No changes are allowed against main.
- **Issue References**: A commits must reference a Forgejo issue and all PRs must close a Forgejo issue.

## Working Issues

- **Read the ENG-DESIGN**: `docs/ENG-DESIGN.md`
- **Test-Driven Development**: Code changes follow TDD, but if no code changes, then no tests.

## Forgejo For Issues and Pull Requests

- For `scripts/forgejo.sh`, always execute commands via Bash only:
  - `bash -lc "source scripts/forgejo.sh && <command>"`
- DO NOT USE `_forgejo_curl` or `_forgejo_pr_agent_curl` directly:
  - if you need extra functionality look in `scripts/forgejo-swagger.json` and create a new method in `scripts/forgejo.sh`
