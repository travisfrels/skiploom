# V0.11 Production Deploy

| Status | Set On |
|--------|--------|
| Draft | 2026-03-04 |
| Active | 2026-03-04 |
| Done | 2026-03-04 |

## Context

### Situation

Skiploom has a complete staging deployment via Docker Compose (`--profile staging`) on the local host. The staging pattern includes `backend-staging` and `frontend-staging` services in `compose.yml`, secrets via Docker Compose file-based secrets with Spring configtree, `scripts/deploy-staging.sh` for validated deploy with health checks, and documentation in the Runbook.

The PostgreSQL instance already creates a `skiploom-production` database (`infra/postgres/init-databases.sql`), and `application-production.yml` exists but uses `${ENV_VAR}` fallbacks for secrets — inconsistent with the staging configtree-only pattern.

### Opportunity

There is no production environment. After verifying changes in staging, there is no deployed production instance to serve actual users. The infrastructure pattern is proven via staging and can be replicated for production with minimal effort.

### Approach

Mirror the staging deploy pattern: add production services to `compose.yml` under a `production` profile, create a deploy script, align `application-production.yml` with the staging configtree pattern, and document the procedure.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting model | Same Docker Compose host | ~5-user community app; staging pattern proven; same machine, same PostgreSQL instance |
| Host ports | 8082 (backend) / 5175 (frontend) | Continues dev→staging increment pattern (8080/5173 → 8081/5174 → 8082/5175) |
| Secrets pattern | Configtree-only (align with staging) | Remove `${ENV_VAR}` fallbacks from `application-production.yml`; all secrets via `/run/secrets/` configtree |
| OAuth2 credentials | Shared with staging | Same Google OAuth2 client; add `http://localhost:5175/login/oauth2/code/google` redirect URI in Google Cloud Console |

## Goals

- Production backend and frontend run as Docker Compose services
- Production connects to `skiploom-production` database
- Production deploy is a single documented command
- Secrets management is consistent across staging and production

## Non-Goals

- Cloud hosting or external deployment platform
- Container registry or image publishing
- TLS/SSL termination or reverse proxy
- Zero-downtime deployment
- Monitoring, alerting, or log aggregation
- E2E testing against production
- Automated deploy on merge (CI/CD pipeline to production)

## Exit Criteria

- [ ] `backend-production` and `frontend-production` services defined in `compose.yml` under `profiles: [production]`
- [ ] Production backend connects to `skiploom-production` database
- [ ] Production backend CORS allows requests from `http://localhost:5175`
- [ ] Production services expose host ports 8082 (backend) and 5175 (frontend) with no conflicts
- [ ] `application-production.yml` uses configtree-only secrets pattern (matching staging)
- [ ] `scripts/deploy-production.sh` validates, deploys, and verifies the production stack
- [ ] Production deploy procedure documented in Runbook with ports and Togglz console URL
- [ ] End-to-end: run `bash scripts/deploy-production.sh`, verify containers are healthy, access `http://localhost:5175` in a browser, and log in via Google OAuth2

## References

- [Milestone: V0.11 Production Deploy](https://github.com/travisfrels/skiploom/milestone/6)
- [Issue #149: Add production services to compose.yml](https://github.com/travisfrels/skiploom/issues/149)
- [Issue #150: Create deploy-production.sh script](https://github.com/travisfrels/skiploom/issues/150)
- [Issue #152: Document production deploy in Runbook](https://github.com/travisfrels/skiploom/issues/152)

### Follow-Up Issues

- [Issue #155: Inline sub-skill references to prevent turn-boundary orphaning](https://github.com/travisfrels/skiploom/issues/155)
- [Issue #160: Add documentation cross-reference check to review process](https://github.com/travisfrels/skiploom/issues/160)

### Pull Requests

- [PR #153: #149 Add production services to compose.yml](https://github.com/travisfrels/skiploom/pull/153)
- [PR #154: #150 Create deploy-production.sh script](https://github.com/travisfrels/skiploom/pull/154)
- [PR #156: #155 Inline sub-skill references to prevent turn-boundary orphaning](https://github.com/travisfrels/skiploom/pull/156)
- [PR #157: #152 Document production deploy in Runbook](https://github.com/travisfrels/skiploom/pull/157)
- [PR #161: #158 Post-Mortem: V0.11 Production Deploy](https://github.com/travisfrels/skiploom/pull/161)
- [PR #186: #160 Add documentation cross-reference check to review process](https://github.com/travisfrels/skiploom/pull/186)

### Design References

- V0.2 Staging Deploy project: `docs/projects/archive/V0_2-STAGING-DEPLOY.md`
- [ADR-OP-SECRETS-20260215](../adrs/ADR-OP-SECRETS-20260215.md): Docker Compose file-based secrets pattern

## Post-Mortem

V0.11 completed all planned work and one follow-up issue in a single session. The project mirrored the staging deploy pattern for production — a straightforward replication that executed cleanly. 3 planned issues produced 1 unplanned follow-up issue (#155, a tooling fix for skill turn-boundary orphaning discovered during the workflow).

### Timeline

| When | Event |
|------|-------|
| 17:38 UTC | Milestone created; project definition drafted |
| 17:39 | Issues #149 (compose services), #150 (deploy script), #152 (runbook docs) created |
| 18:06 | PR #153 opened for #149 |
| 18:08 | PR #153 review identifies stale documentation in ENG-DESIGN.md |
| 18:40 | PR #153 merged after defect fix |
| 18:45 | PR #154 opened for #150 |
| 18:56 | Follow-up issue #155 (skill orphaning) created |
| 18:58 | PR #156 opened for #155; PR #154 merged (no review) |
| 19:07 | PR #156 merged |
| 19:11 | PR #157 opened for #152 |
| 19:21 | PR #157 review confirms production deploy verified via deploy script and OAuth2 login |
| 19:26 | PR #157 merged; all planned work complete |

All times are 2026-03-04 UTC. Cycle time is elapsed time, not active work time.

### Impact

| Metric | Value |
|--------|-------|
| Milestone duration | 1h 48m |
| Planned issues | 3 |
| Follow-up issues | 1 (#155) |
| Total PRs | 4 |
| Issue cycle time (avg) | 63m (planned only) |
| PR cycle time (avg) | 18m |
| PRs with reviews | 3 of 4 (75%) |
| Defects found in review | 1 (stale documentation) |
| Scope changes | None — exit criteria unchanged |

### What Went Well

- **Pattern replication worked.** The staging deploy established a proven template. Production services, deploy script, and runbook documentation all mirrored staging with minimal adaptation (port numbers, profile names). This is the intended benefit of the staging-first approach.
- **PR review caught a defect.** The review on PR #153 identified a stale ENG-DESIGN.md reference to the old `${ENV_VAR}` secrets pattern. Without the review, production documentation would have been inconsistent with the actual configuration.
- **End-to-end verification succeeded.** PR #157 review confirmed the full deploy: `bash scripts/deploy-production.sh` ran successfully, containers were healthy, and OAuth2 login worked at `http://localhost:5175/`.
- **Follow-up issue was contained.** Issue #155 (skill turn-boundary orphaning) was discovered, implemented, and merged within 11 minutes. It addressed a real process gap without disrupting the main project flow.

### What Went Wrong

PR #154 was merged without a review. The other three PRs all received reviews, and one of those reviews caught a defect. Skipping review for a "simple" pattern-replication PR is inconsistent with the process applied to the rest of the project.

| Issue | Contributing Factors | Category |
|-------|---------------------|----------|
| PR #154 merged without review | No enforcement mechanism requiring reviews; pattern-replication PRs perceived as low-risk | Process |
| Stale ENG-DESIGN.md reference in initial PR #153 | Multiple sections in ENG-DESIGN.md describe environment-specific behavior, creating redundant descriptions that can drift | Process |

### Recommendations

Actionable improvements for future projects, highest priority first.

| Priority | Recommendation | Issue |
|----------|---------------|-------|
| Medium | Ensure all PRs receive reviews before merge — evaluate branch protection rules or establish a self-review convention | [#159](https://github.com/travisfrels/skiploom/issues/159) |
| Low | When modifying environment-specific configuration, search ENG-DESIGN.md for all references to the affected environment to ensure consistency | [#160](https://github.com/travisfrels/skiploom/issues/160) |
