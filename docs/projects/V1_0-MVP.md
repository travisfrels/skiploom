# V1.0 MVP

| Status | Set On |
|--------|--------|
| Active | 2026-02-05 |
| Done | 2026-03-04 |

## Context

### Situation

Recipes are tracked using manual methods — paper, cards, and informal sharing. There is no centralized, searchable repository accessible to all community members.

### Opportunity

A digital recipe management system would replace fragmented manual tracking with a shared, editable, searchable repository. Community members could contribute and discover recipes without relying on physical media.

### Approach

Build a three-tier application (React SPA, Kotlin/Spring API, PostgreSQL) deployed as locally hosted Docker containers for approximately 5 concurrent users. Deliver incrementally: frontend first to validate UX, then backend, then operational persistence.

## Goals

- Enable open recipe sharing across the user community
- Allow all community members to contribute recipes
- Run the system locally via Docker Compose
- Authentication

## Non-Goals

- Per-user access restrictions on recipes
- Recipe versioning or history tracking
- Meal planning or shopping list generation
- Production cloud hosting
- Authorization

## Exit Criteria

- [x] Frontend application with recipe list, detail, and form views
- [x] Backend REST API with CQRS command and query endpoints
- [x] Clean architecture with domain isolated from infrastructure
- [x] Jakarta Bean Validation with RFC 7807 error responses
- [x] Frontend-backend integration with error handling
- [x] Comprehensive test coverage across both tiers
- [x] PostgreSQL operational persistence via Docker Compose
- [x] System runs end-to-end locally

## Path to V1.0

Eleven projects delivered the MVP over 28 days (Feb 5 – Mar 4, 2026). The path ran from first persistence through a catastrophic data loss and recovery to production deployment.

### Foundation (V0.1, Feb 8–9)

Replaced the in-memory repository with PostgreSQL-backed persistence via Flyway migrations and JPA entities, completing the three-tier architecture defined in the engineering design.

### Deployment (V0.2, Feb 9 – Feb 17)

Established the staging deploy pattern: Docker Compose profiles, multi-stage Dockerfiles, and a deploy script with health checks. This pattern became the template that V0.11 replicated for production. The project's post-mortem identified the untested-integration anti-pattern — five planned issues produced five unplanned follow-ups from a serial failure chain in the deploy pipeline.

### Security (V0.3–V0.4, Feb 14–16)

V0.3 added Google OAuth2 authentication with server-side sessions, CSRF protection, and user persistence on first login. V0.4 introduced Docker Compose file-based secrets management to replace hardcoded credentials. During V0.4, `docker compose down -v` destroyed the self-hosted Forgejo instance — the project's issue tracker, CI system, and all project management history (85+ issues, all PRs, all comments). The code survived in git; the decision-making context was irrecoverable.

### Recovery (V0.5, Feb 16–17)

Migrated issue tracking and CI from self-hosted Forgejo to GitHub, eliminating the circular dependency that caused the V0.4 data loss. Eight issues closed, seven PRs merged, zero failed CI runs. The three carried-forward V0.4 issues (configtree migration, committed secrets removal, secret rotation) were resolved alongside the migration.

### Quality and Process (V0.6–V0.7, Feb 18–19)

V0.6 added Playwright end-to-end testing covering core recipe flows, CI integration with HTML artifact reports, and a defect reporting workflow via GitHub issue templates. V0.7 standardized the project workflow: consistent post-mortem structure across skills, GitHub Milestones for automated progress tracking, and expanded documentation for both humans and agents.

### Features (V0.8–V0.10, Feb 20 – Mar 4)

V0.8 integrated Togglz for feature flagging with JDBC persistence, an admin console, and a frontend flag consumption pipeline. V0.9 added dark mode support using Tailwind CSS v4's `prefers-color-scheme` variant — a CSS-only change with zero backend impact. V0.10 delivered fractional ingredient amounts (displaying "1/2 cup" instead of "0.5 cup") as a frontend-only conversion gated behind a release toggle, validating the full feature flag lifecycle end-to-end.

### Production (V0.11, Mar 4)

Mirrored the staging deploy pattern for production: added `backend-production` and `frontend-production` services to `compose.yml`, created `deploy-production.sh`, aligned `application-production.yml` with the configtree secrets pattern, and documented the procedure in the Runbook. Three planned issues, one follow-up, four PRs — completed in 1 hour 48 minutes.

## References

- [V0.1 Operational Persistence](archive/V0_1-OP-PERSISTENCE.md)
- [V0.2 Staging Deploy](archive/V0_2-STAGING-DEPLOY.md)
- [V0.3 Operational Authentication](archive/V0_3-OP-AUTHENTICATION.md)
- [V0.4 Secrets Management](archive/V0_4-SECRETS-MANAGEMENT.md)
- [V0.5 GitHub Migration](archive/V0_5-GITHUB-MIGRATION.md)
- [V0.6 E2E Testing](archive/V0_6-E2E-TESTING.md)
- [V0.7 Project Workflow](archive/V0_7-PROJECT-WORKFLOW.md)
- [V0.8 Feature Flagging](archive/V0_8-FEATURE-FLAGGING.md)
- [V0.9 Dark Mode Support](archive/V0_9-DARK-MODE-SUPPORT.md)
- [V0.10 Ingredient Fraction Amounts](archive/V0_10-INGREDIENT-FRACTION-AMOUNTS.md)
- [V0.11 Production Deploy](archive/V0_11-PRODUCTION-DEPLOY.md)
