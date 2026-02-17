# V0.5 GitHub Migration

| Status | Created | Updated |
|--------|---------|---------|
| Draft | 2026-02-16 | 2026-02-16 |

## Context

### Situation

The project self-hosts its issue tracker (Forgejo) as part of its own Docker Compose infrastructure. The issue tracker, CI runner, git hosting, and application services all share the same `compose.yml` and the same Docker volumes. `scripts/forgejo.sh` wraps the Forgejo REST API for issue and PR management. Two CI workflows (`.forgejo/workflows/ci.yml` and `deploy-staging.yml`) run on the local Forgejo Actions runner.

### Opportunity

The issue tracker has a circular dependency on the infrastructure it tracks. A `docker compose down -v` during infrastructure work destroyed the entire Forgejo instance — 85+ issues, all PRs, comments, user accounts, and API tokens. This is a structural problem: behavioral rules ("don't run that command") are the weakest form of protection against a class of failure that is inherent to the architecture.

Moving the issue tracker and CI to GitHub eliminates the circular dependency entirely. The issue tracker becomes independent of the project's Docker infrastructure. GitHub provides managed backups, uptime, access control, and CI at zero cost.

### Approach

Create the GitHub repository first, then track all migration work as GitHub issues. Forgejo stays running in parallel until migration is complete — no premature teardown.

Replace `scripts/forgejo.sh` with direct `gh` CLI usage — the CLI already handles authentication, pagination, and output formatting, so a wrapper script adds no value. Convert `.forgejo/workflows/` to `.github/workflows/`. Remove Forgejo and runner services from `compose.yml`. For local staging deployment, use a GitHub self-hosted runner or manual `docker compose --profile staging up`.

#### Alternatives not chosen

- **External hosted Forgejo (Codeberg)** — Eliminates the circular dependency but requires maintaining API compatibility with a less widely adopted platform. The `forgejo.sh` wrapper would need minor URL changes but no structural rewrite. Chosen against because GitHub is more idiomatic, has better tooling (`gh` CLI), and offers more CI minutes on the free tier.
- **Separate local Compose stack** — Moves Forgejo to its own `compose.yml` in a separate directory so `docker compose down -v` on skiploom can't destroy it. Reduces blast radius but doesn't eliminate it (same machine, no external backup, still self-hosted). More operational complexity for an incomplete fix.
- **No change** — Relies on behavioral rules to prevent recurrence. The risk is structural; behavioral controls are insufficient.

## Goals

- Issue tracking, PRs, and CI run on GitHub (free tier)
- `scripts/forgejo.sh` replaced with direct `gh` CLI usage
- `.claude/skills/` updated to use `gh` CLI instead of `forgejo.sh`
- CI workflows ported to GitHub Actions
- Forgejo and runner services removed from `compose.yml`
- Local staging deployment still works
- Open issues migrated to GitHub

## Non-Goals

- Production deployment changes
- Changing the application architecture
- Migrating git history of destroyed Forgejo PRs/issues (irrecoverable)
- Self-hosted GitHub Actions runner setup (can be added later if auto-deploy-on-merge is needed)

## Exit Criteria

- [x] GitHub repository exists with full git history pushed
- [x] Open Forgejo issues recreated as GitHub issues
- [x] `.github/workflows/ci.yml` runs backend and frontend tests on PRs
- [ ] `.github/workflows/deploy-staging.yml` deploys locally on merge to main (self-hosted runner) OR is replaced with manual deployment documented in README
- [x] Agent skills updated to use `gh` CLI instead of `forgejo.sh`
- [x] Forgejo and runner services removed from `compose.yml`
- [x] `infra/forgejo/setup.sh` removed or reduced to application-only setup
- [x] `docker compose up` starts only application services (postgres, backend-staging, frontend-staging)
- [x] A PR can be created, reviewed, and merged entirely through GitHub
- [x] End-to-end: push a branch, CI runs, PR is created, PR is merged

## References

- [Issue #1: Migrate Spring Boot development profile to configtree secrets](https://github.com/travisfrels/skiploom/issues/1) (V0.4, carried forward)
- [Issue #2: Remove committed secrets and update documentation](https://github.com/travisfrels/skiploom/issues/2) (V0.4, carried forward)
- [Issue #3: Rotate compromised secrets](https://github.com/travisfrels/skiploom/issues/3) (V0.4, carried forward)
- [Issue #4: Port CI workflow to GitHub Actions](https://github.com/travisfrels/skiploom/issues/4)
- [Issue #5: Update agent skills to use gh CLI instead of forgejo.sh](https://github.com/travisfrels/skiploom/issues/5)
- [Issue #6: Remove Forgejo and runner services from compose.yml](https://github.com/travisfrels/skiploom/issues/6)
- [Issue #7: Configure GitHub branch protection and end-to-end validation](https://github.com/travisfrels/skiploom/issues/7)

### Follow-Up Issues

### Pull Requests

- [PR #8: #5 Update agent skills to use gh CLI instead of forgejo.sh](https://github.com/travisfrels/skiploom/pull/8)
- [PR #9: #4 Port CI workflow to GitHub Actions](https://github.com/travisfrels/skiploom/pull/9)
- [PR #10: #6 Remove Forgejo and runner services from compose.yml](https://github.com/travisfrels/skiploom/pull/10)
- [PR #11: #2 Remove committed secrets and update documentation](https://github.com/travisfrels/skiploom/pull/11)
- [PR #12: #3 Rotate compromised secrets](https://github.com/travisfrels/skiploom/pull/12)
- [PR #17: #7 Configure GitHub branch protection](https://github.com/travisfrels/skiploom/pull/17)

### Design References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI (`gh`) Manual](https://cli.github.com/manual/)
- [GitHub Free Tier](https://github.com/pricing) — unlimited public/private repos, 2000 Actions minutes/month
- [GitHub Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
