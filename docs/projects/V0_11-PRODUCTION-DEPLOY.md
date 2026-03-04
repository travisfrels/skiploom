# V0.11 Production Deploy

| Status | Set On |
|--------|--------|
| Draft | 2026-03-04 |
| Active | 2026-03-04 |

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

(none yet)

### Pull Requests

- [PR #153: #149 Add production services to compose.yml](https://github.com/travisfrels/skiploom/pull/153)
- [PR #154: #150 Create deploy-production.sh script](https://github.com/travisfrels/skiploom/pull/154)

### Design References

- V0.2 Staging Deploy project: `docs/projects/V0_2-STAGING-DEPLOY.md`
- [ADR-OP-SECRETS-20260215](../adrs/ADR-OP-SECRETS-20260215.md): Docker Compose file-based secrets pattern
