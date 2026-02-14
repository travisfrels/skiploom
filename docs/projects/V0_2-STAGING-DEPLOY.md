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

### Summary

5 planned issues produced 5 unplanned follow-up issues — a 1:1 ratio of planned to reactive work. The Dockerfiles, staging services, and CORS configuration landed cleanly. The deploy pipeline did not. Issues #34, #36, #38, and #40 formed a serial failure chain where each fix, once merged, unmasked the next failure. The pipeline required four merge-discover-fix cycles before it functioned.

### What Went Well

- **Issue decomposition was clean.** #24–#27 were well-scoped, independent, and each closed with a single PR.
- **Dockerfiles worked first try.** The multi-stage builds for backend and frontend required no follow-up fixes.
- **CORS was handled proactively.** Profile-based `allowed-origins` with environment variable injection worked immediately.
- **Healthcheck was caught in review.** #31 was identified during PR #30 review — a genuine success of code review as a quality gate.
- **Root cause analysis was thorough.** Every follow-up issue included a clear diagnosis and targeted fix.

### What Went Wrong

**The deploy workflow was never tested before merge.** PRs #33, #35, #37, #39, and #41 all had unchecked test plan items like "Merge to main and verify..." — the testing strategy was merge and pray. This is the untested integration anti-pattern: each component was reviewed in isolation, but the system was never validated as a whole.

The four serial failures:

| Issue | Root Cause | Category |
|-------|-----------|----------|
| #34 | sed pattern only matches fresh `.runner` state | Stale state assumption |
| #36 | `docker:27` has no Node.js for `actions/checkout` | Unvalidated tool compatibility |
| #38 | `valid_volumes` whitelists but doesn't mount | Misread documentation |
| #40 | nginx `proxy_pass` trailing slash strips path prefix | Well-known gotcha, not caught |

**The exit criteria treated the pipeline as components, not a system.** No criterion required end-to-end validation: merge a PR and confirm staging is serving traffic.

### Improvement Issues

- [Issue #46: Add deployment verification to deploy-staging workflow](http://localhost:3000/skiploom-agent/skiploom/issues/46)
- [Issue #47: Add end-to-end validation guidance to project template exit criteria](http://localhost:3000/skiploom-agent/skiploom/issues/47)
- [Issue #48: Validate runner configuration after registration](http://localhost:3000/skiploom-agent/skiploom/issues/48)
