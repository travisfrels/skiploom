# ADR: GitHub as Development Platform

## Status

Accepted

## Context

The project previously used a self-hosted Forgejo instance as its development platform, providing git hosting, issue tracking, pull requests, and CI/CD via Forgejo Actions (see [ADR-DEV-DEVPLATFORM-20260206](ADR-DEV-DEVPLATFORM-20260206.md)). Forgejo ran as a Docker Compose service alongside the application, sharing the same `compose.yml` and PostgreSQL instance.

This architecture created a circular dependency: the issue tracker was part of the infrastructure it tracked. A `docker compose down -v` during infrastructure work destroyed the entire Forgejo instance — 85+ issues, all PRs, comments, user accounts, and API tokens. Behavioral rules ("don't run that command") are the weakest form of protection against a failure mode that is inherent to the architecture.

## Decision

We will migrate the development platform to **GitHub**, using GitHub Issues for issue tracking, GitHub Pull Requests for code review, and GitHub Actions for CI/CD.

## Rationale

| Criterion | GitHub | External Forgejo (Codeberg) | Separate Local Compose Stack |
|-----------|--------|----------------------------|------------------------------|
| Impact | High — eliminates circular dependency entirely | Medium — eliminates circular dependency but less tooling support | Low — reduces blast radius but doesn't eliminate it |
| Least Astonishment | High — GitHub is the standard platform for open-source and small-team projects | Medium — less widely adopted, API differs from GitHub | Low — unusual setup, more operational complexity |
| Idiomaticity | High — `gh` CLI is first-class, Actions is the dominant CI platform | Medium — requires maintaining `forgejo.sh` wrapper | Low — non-standard, no external backup |

**Why not external Forgejo (Codeberg)?**

Eliminates the circular dependency but requires maintaining API compatibility with a less widely adopted platform. The `forgejo.sh` wrapper would need URL changes but no structural rewrite. GitHub offers better tooling (`gh` CLI), more CI minutes on the free tier, and is more idiomatic for the project's context.

**Why not a separate local Compose stack?**

Moves Forgejo to its own `compose.yml` so application infrastructure changes can't destroy it. Reduces blast radius but doesn't eliminate it — same machine, no external backup, still self-hosted. More operational complexity for an incomplete fix.

**Why not no change?**

Relies on behavioral rules to prevent recurrence. The risk is structural; behavioral controls are insufficient.

## Consequences

**Positive:**

- Issue tracker is independent of project infrastructure — no risk of data loss from Docker operations
- GitHub provides managed backups, uptime, and access control at zero cost
- `gh` CLI replaces the custom `forgejo.sh` wrapper — less code to maintain
- GitHub Actions provides CI/CD with 2000 free minutes/month
- Standard platform reduces onboarding friction

**Negative:**

- External dependency on GitHub availability
- Loss of self-hosted control over the development platform
- Historical Forgejo issues/PRs are irrecoverable

**Neutral:**

- Forgejo services, runner, and related infrastructure removed from `compose.yml`
- `scripts/forgejo.sh` and `.forgejo/workflows/` removed
- Agent skills updated to use `gh` CLI directly

## References

- [V0.5 GitHub Migration Project](../projects/V0_5-GITHUB-MIGRATION.md)
- Supersedes [ADR-DEV-DEVPLATFORM-20260206](ADR-DEV-DEVPLATFORM-20260206.md)
