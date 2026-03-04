# V0.5 GitHub Migration

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-16 | 2026-02-17 |

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
- [x] Staging deployment replaced with manual procedure documented in Runbook (self-hosted runner deferred as non-goal)
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
- [Issue #14: Re-Implement Staging Deploy in GitHub](https://github.com/travisfrels/skiploom/issues/14)

### Follow-Up Issues

- [Issue #25: Clean up stale Forgejo URLs in project docs](https://github.com/travisfrels/skiploom/issues/25)

### Pull Requests

- [PR #8: #5 Update agent skills to use gh CLI instead of forgejo.sh](https://github.com/travisfrels/skiploom/pull/8)
- [PR #9: #4 Port CI workflow to GitHub Actions](https://github.com/travisfrels/skiploom/pull/9)
- [PR #10: #6 Remove Forgejo and runner services from compose.yml](https://github.com/travisfrels/skiploom/pull/10)
- [PR #11: #2 Remove committed secrets and update documentation](https://github.com/travisfrels/skiploom/pull/11)
- [PR #12: #3 Rotate compromised secrets](https://github.com/travisfrels/skiploom/pull/12)
- [PR #17: #7 Configure GitHub branch protection](https://github.com/travisfrels/skiploom/pull/17)
- [PR #22: #14 Re-implement staging deploy in GitHub](https://github.com/travisfrels/skiploom/pull/22)

### Design References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI (`gh`) Manual](https://cli.github.com/manual/)
- [GitHub Free Tier](https://github.com/pricing) — unlimited public/private repos, 2000 Actions minutes/month
- [GitHub Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)

## Post-Mortem

### Summary

5 original issues (#4–#7, #14) and 3 carried-forward V0.4 issues (#1–#3) produced 7 PRs (#8–#12, #17, #22), all merged. All 10 exit criteria were met. One follow-up issue was identified: stale Forgejo URLs remaining in earlier project docs (#25). No V0.3-style cascading failures — the migration was structurally straightforward because it replaced tooling and infrastructure without changing application behavior.

The project was motivated by the V0.4 data loss incident, where `docker compose down -v` destroyed the self-hosted Forgejo instance containing 85+ issues, all PRs, and all CI history. V0.5 eliminated the circular dependency by moving issue tracking and CI to GitHub. The ADR ([ADR-DEV-DEVPLATFORM-20260216](../adrs/ADR-DEV-DEVPLATFORM-20260216.md)) documents the decision and alternatives.

### What Went Well

- **Execution was fast and clean.** 8 issues closed, 7 PRs merged, no failed CI runs blocking progress. The migration completed within two days of the data loss incident.
- **PR reviews caught real defects.** PR #8's review found an invalid `gh pr reviews` subcommand in agent skills. PR #10's review found that `.env` deletion was missed despite appearing in the implementation plan, issue scope, and test plan. PR #12's review found a prematurely checked exit criterion in V0.4. PR #8's review identified scope creep from issue #1. None of these would have been caught without review.
- **ADR was created with alternatives analysis.** The platform decision was documented with a comparison table evaluating GitHub, external Forgejo (Codeberg), and a separate local Compose stack against impact, least astonishment, and idiomaticity criteria. This is the first ADR to follow the full template established in the ADR CLAUDE.md.
- **Zero-downtime migration.** Forgejo ran in parallel until PR #10 removed it. No work was lost during the transition. Issues were recreated on GitHub before Forgejo services were torn down.
- **V0.4 carried-forward issues resolved.** Issues #1–#3 (configtree migration, committed secrets removal, secret rotation) were completed alongside the migration, clearing the backlog from the data loss incident.

### What Went Wrong

- **Project status never updated to "Done."** All 10 exit criteria were checked off, but the status field remained "Draft." Exit criteria checkboxes signal completion of individual items; the status field signals the project's overall state. These are separate concerns, and the status update was missed.
- **Scope creep in PR #8.** GitHub push protection blocked pushing committed credentials, forcing PR #8 (issue #5: update agent skills) to also remove hardcoded credentials from `application-development.yml` — work that belonged to issue #1. The cross-cutting change was noted in the PR review but not documented in issue #1, making the dependency invisible from the issue's perspective.
- **`.env` deletion missed in PR #10.** The issue scope, implementation plan, and test plan for issue #6 all called for deleting `.env`. The PR omitted it. The PR review caught the omission, and the deletion was completed in PR #11 instead. The implementation plan was correct; the execution didn't follow through.
- **Stale Forgejo URLs left behind.** Dead `localhost:3000` links remain in V0.1 and V0.3 project docs, pointing to issues and PRs that no longer exist. These were not caught during the migration because V0.5's scope was forward-looking (port to GitHub) rather than backward-looking (clean up references to Forgejo). Filed as follow-up issue #25.

| Issue | Root Cause | Category |
|-------|-----------|----------|
| Status not updated | Close-out step missed | Process gap |
| PR #8 scope creep | GitHub push protection forced cross-cutting change | External constraint |
| `.env` not deleted | Implementation diverged from plan | Execution error |
| Stale Forgejo URLs | Migration scope didn't include retroactive cleanup | Scope gap |

### Recommendations

1. **Update the project status field when checking off the last exit criterion.** The status and the checkboxes serve different purposes. A project with all criteria checked but status "Draft" is ambiguous — is it done, or is the author still reviewing? Make the status update part of the close-out, not an afterthought.

2. **When external constraints force scope creep, document it in both the source and target issues.** PR #8 was forced to address issue #1's credentials because GitHub push protection blocked the push. The PR review noted this, but issue #1 had no record of the partial resolution. When work crosses issue boundaries, both issues should reference the change so that future readers can trace what happened and why.
