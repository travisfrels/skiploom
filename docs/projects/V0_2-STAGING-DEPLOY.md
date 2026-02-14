# V0.2 Staging Deploy

| Status | Created | Updated |
|--------|---------|---------|
| Draft | 2026-02-09 | 2026-02-09 |

## Context

### Situation

The CI pipeline runs tests on pull requests to `main` via Forgejo Actions, but merging a PR does not trigger any deployment. The staging database (`skiploom-staging`) exists in PostgreSQL, and Spring profiles for staging are configured, but no staging containers run and no Dockerfiles exist for the application.

### Opportunity

Automating deployment to staging on merge to `main` closes the loop between code review and a running environment. Developers can verify integrated behavior immediately after merge without manual intervention.

### Approach

Build Docker images for the backend and frontend, define staging services in `compose.yml` under a `staging` Docker Compose profile, and add a Forgejo Actions workflow that triggers on push to `main` to build and deploy. The runner is configured with a `deploy` label (`docker:27`) and Docker socket access to build images and manage containers directly. Each merge rebuilds images so compose always runs the latest version.

## Goals

- Backend and frontend are containerized via Dockerfiles
- Staging backend connects to `skiploom-staging` with environment-provided credentials
- Staging frontend can reach the backend REST API
- Staging services are accessible on host ports distinct from development
- Merging a PR to `main` automatically builds and deploys the latest staging containers

## Non-Goals

- Production deployment
- Container registry or image publishing
- Health checks or rollback automation
- Zero-downtime deployment
- Monitoring or alerting

## Exit Criteria

- [ ] Backend Dockerfile produces a runnable image (multi-stage: Gradle build, JRE runtime)
- [ ] Frontend Dockerfile produces a runnable image (multi-stage: npm build, static server)
- [ ] Staging backend connects to `skiploom-staging` with environment-provided credentials
- [ ] Backend CORS configured to allow staging frontend requests
- [ ] Frontend container can reach the backend API in the staging network
- [ ] Staging services expose host ports that do not conflict with development services
- [ ] Staging services defined in `compose.yml` under a `staging` profile
- [ ] Runner configured with a `deploy` label (`docker:27`) and Docker socket access
- [ ] Deploy workflow (`.forgejo/workflows/deploy-staging.yml`) triggers on push to `main`
- [ ] After merging a PR, staging containers are rebuilt and running with the latest images

## References

- [Issue #23: Implement Staging Deploy](http://localhost:3000/skiploom-agent/skiploom/issues/23)
- [Issue #24: Create backend and frontend Dockerfiles](http://localhost:3000/skiploom-agent/skiploom/issues/24)
- [Issue #25: Add staging services and deploy runner to compose.yml](http://localhost:3000/skiploom-agent/skiploom/issues/25)
- [Issue #26: Configure backend CORS for staging](http://localhost:3000/skiploom-agent/skiploom/issues/26)
- [Issue #27: Add deploy-staging workflow](http://localhost:3000/skiploom-agent/skiploom/issues/27)

### Follow-Up Issues

- [Issue #31: Add healthcheck to backend-staging service](http://localhost:3000/skiploom-agent/skiploom/issues/31)
- [Issue #34: Deploy runner missing deploy label due to stale runner registration](http://localhost:3000/skiploom-agent/skiploom/issues/34)
- [Issue #36: Deploy-staging fails: docker:27 image lacks Node.js for actions/checkout](http://localhost:3000/skiploom-agent/skiploom/issues/36)
- [Issue #38: Deploy-staging fails: job container lacks Docker socket mount](http://localhost:3000/skiploom-agent/skiploom/issues/38)
- [Issue #40: Staging frontend proxy strips /api prefix, causing 404s](http://localhost:3000/skiploom-agent/skiploom/issues/40)

### Pull Requests

- [PR #28: Add V0.2 Staging Deploy project definition (#23)](http://localhost:3000/skiploom-agent/skiploom/pulls/28)
- [PR #29: #24 Create backend and frontend Dockerfiles](http://localhost:3000/skiploom-agent/skiploom/pulls/29)
- [PR #30: #25 Add staging services and deploy runner to compose.yml](http://localhost:3000/skiploom-agent/skiploom/pulls/30)
- [PR #32: #26 Configure backend CORS for staging](http://localhost:3000/skiploom-agent/skiploom/pulls/32)
- [PR #33: #27 Add deploy-staging workflow](http://localhost:3000/skiploom-agent/skiploom/pulls/33)
- [PR #35: #34 Fix runner deploy label by broadening sed pattern](http://localhost:3000/skiploom-agent/skiploom/pulls/34)
- [PR #37: #36 Replace actions/checkout with manual git clone in deploy-staging](http://localhost:3000/skiploom-agent/skiploom/issues/37)
- [PR #39: #38 Mount Docker socket in job containers via docker_host automount](http://localhost:3000/skiploom-agent/skiploom/issues/39)
- [PR #41: #40 Remove trailing slash from staging BACKEND_URL to fix proxy path stripping](http://localhost:3000/skiploom-agent/skiploom/issues/41)
- [PR #42: #31 Add healthcheck to backend-staging and wait for readiness](http://localhost:3000/skiploom-agent/skiploom/issues/42)

## Post-Mortem
