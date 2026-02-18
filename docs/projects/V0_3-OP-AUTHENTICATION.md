# V0.3 Operational Authentication

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-14 | 2026-02-17 |

## Context

### Situation

All API endpoints are publicly accessible. Any HTTP client can create, read, update, and delete recipes without identifying itself. The V1.0 MVP lists authentication as a goal, and the system is intended for a broader community where users don't necessarily know each other.

### Opportunity

Adding authentication gates access behind Google login, ensuring only identified community members can interact with the system. Server-side sessions via Spring Security OAuth2 Client provide this with minimal custom code and no token management burden on the frontend.

### Approach

Add `spring-boot-starter-oauth2-client` to the backend. Configure Google as the OAuth2 provider. Define a `SecurityFilterChain` that requires authentication on all endpoints and uses OAuth2 login. Persist authenticated users in a `user` table on first login. Expose a `/api/me` endpoint so the frontend can retrieve the current user's identity. On the frontend, detect 401 responses and redirect to the backend's OAuth2 authorization endpoint.

## Goals

- All API endpoints require authentication via Google OAuth2
- Authenticated user identity is persisted in the database on first login
- Frontend redirects unauthenticated users to Google login
- Frontend displays the current user's identity
- Session-based authentication using server-side sessions and HTTP cookies

## Non-Goals

- Authorization (per-user permissions on recipes)
- Recipe ownership (existing recipes remain unowned; new recipes remain unowned)
- Multiple identity providers (only Google)
- Local username/password authentication
- Session persistence across backend restarts (in-memory sessions are acceptable)
- User management UI (registration, profile editing, account deletion)

### CSRF

Spring Security enables CSRF protection by default. Session-cookie authentication with a same-origin SPA requires CSRF synchronizer tokens. The implementation uses `CookieCsrfTokenRepository` with a non-XOR `CsrfTokenRequestAttributeHandler` and a `CsrfTokenMaterializingFilter` for eager token generation, so the `XSRF-TOKEN` cookie is set on every response and the frontend can read it via `document.cookie` and send it back as `X-XSRF-TOKEN`.

## Exit Criteria

- [x] `spring-boot-starter-oauth2-client` added as a dependency
- [x] Google OAuth2 client ID and secret configured per Spring profile
- [x] `SecurityFilterChain` requires authentication on all `/api/**` endpoints
- [x] OAuth2 login redirects to Google and back to the application on success
- [x] `user` table created via Flyway migration (id, google_subject, email, display_name)
- [x] User record created or updated on first/subsequent login
- [x] `/api/me` endpoint returns the authenticated user's identity
- [x] Frontend detects 401 and redirects to login
- [x] Frontend displays the authenticated user's name
- [x] Unauthenticated request to any API endpoint returns 401
- [x] Authenticated user can browse, create, edit, and delete recipes end-to-end through the UI
- [x] Post-login redirect returns user to the frontend root, not a saved API request (Forgejo #70 — destroyed)
- [x] OAuth2 configuration documented with startup validation for missing credentials (Forgejo #69 — destroyed)

> **Note:** Exit criteria were never formally verified during V0.3 execution. The V0.4 data loss incident destroyed the Forgejo instance before sign-off. Verification was completed post-V0.5 migration against the running staging environment on GitHub.

## References

- [Issue #54: Add V0.3 Authentication project definition](http://localhost:3000/skiploom-agent/skiploom/issues/54)
- [Issue #56: Add Spring Security OAuth2 and SecurityFilterChain](http://localhost:3000/skiploom-agent/skiploom/issues/56)
- [Issue #57: Add user persistence and /api/me endpoint](http://localhost:3000/skiploom-agent/skiploom/issues/57)
- [Issue #58: Add frontend authentication handling](http://localhost:3000/skiploom-agent/skiploom/issues/58)

### Follow-Up Issues

- [Issue #13: Frontend Staging Access Blocked](https://github.com/travisfrels/skiploom/issues/13)
- [Issue #21: API Returns 403 Forbidden After Authenticating](https://github.com/travisfrels/skiploom/issues/21)
- [Issue #69: Add OAuth2 configuration documentation and startup validation](http://localhost:3000/skiploom-agent/skiploom/issues/69)
- [Issue #70: Fix post-login redirect to frontend root](http://localhost:3000/skiploom-agent/skiploom/issues/70)

### Pull Requests

- [PR #55: #54 Add V0.3 Authentication project definition](http://localhost:3000/skiploom-agent/skiploom/pulls/55)
- [PR #66: #56 Add Spring Security OAuth2 and SecurityFilterChain](http://localhost:3000/skiploom-agent/skiploom/pulls/66)
- [PR #67: #57 Add user persistence and /api/me endpoint](http://localhost:3000/skiploom-agent/skiploom/pulls/67)
- [PR #68: #58 Add frontend authentication handling](http://localhost:3000/skiploom-agent/skiploom/pulls/68)
- [PR #20: #13 Fix forwarded headers for staging OAuth2 login](https://github.com/travisfrels/skiploom/pull/20)
- [PR #19: #18 Normalize Spring profile configuration and test strategy](https://github.com/travisfrels/skiploom/pull/19)
- [PR #23: #21 Fix 403 Forbidden on POST after OAuth2 authentication](https://github.com/travisfrels/skiploom/pull/23)

## Post-Mortem

### Summary

6 planned issues (#54, #56, #57, #58, #69, #70) produced 3 follow-up issues (#13, #21, #18) — a 2:1 ratio of planned to reactive work. The core OAuth2 implementation (PRs #66, #67, #68) landed cleanly as individual components. The failures were all integration-level: CSRF token generation broke POST requests (#21), missing forwarded headers broke staging OAuth2 (#13), and inconsistent profile configuration broke local tests (#18, discovered during #13). None of these failures were caught before the project was marked "Done" because the end-to-end exit criterion was never actually verified.

The V0.4 Secrets Management data loss incident — which occurred the day after V0.3 was marked complete — destroyed all Forgejo project management artifacts for V0.3. This post-mortem is reconstructed from git history, commit messages, and the follow-up issues created on GitHub after V0.5 migration.

### V0.4 Data Loss Impact

During V0.4 implementation on Feb 16, the AI agent ran `docker compose down -v`, destroying all Docker volumes including the Forgejo instance. The following V0.3 artifacts were permanently lost:

- **Issues #54–#70**: All original issue descriptions, acceptance criteria, and discussion threads
- **PRs #55–#75**: All pull request descriptions, review comments, and test plan verifications
- **Sign-off state**: Exit criteria were never formally checked off — the project was marked "Done" on Feb 15, Forgejo was destroyed on Feb 16

The code changes survived in git. The V0.3 project definition document survived because it was committed to the repository. But the decision-making context — why specific implementation choices were made, what was discussed in PR reviews, what test plans were verified — is irrecoverable.

Findings in this post-mortem are reconstructed from: git commit messages, the V0.3 project definition, and the three follow-up issues (#13, #18, #21) which were created on GitHub after V0.5 migration and contain detailed root cause analysis.

### What Went Well

- **Core implementation was clean.** The three main PRs (#66, #67, #68) each addressed a distinct concern — security config, user persistence, frontend handling — with no overlap or rework. The decomposition into separate issues was effective.
- **Frontend CSRF pattern was correct from the start.** `shared.ts` already read the `XSRF-TOKEN` cookie and sent `X-XSRF-TOKEN` on every request. When the backend CSRF bug (#21) was fixed, no frontend changes were needed.
- **Follow-up root cause analysis was thorough.** Issues #13 and #21 both included detailed implementation post-mortems with clear diagnosis, corrected design decisions, and verification against the running staging environment.
- **Issue #13 corrected its own wrong initial decision.** The first attempt chose NATIVE forwarded header strategy. When testing revealed it overrides the port, the implementation was corrected to FRAMEWORK with a documented explanation of why the original decision was wrong. The correction was made within the same PR rather than spawning another follow-up.

### What Went Wrong

**The end-to-end exit criterion was never verified.** The exit criteria included "Authenticated user can browse, create, edit, and delete recipes end-to-end through the UI." This criterion existed specifically because V0.2's post-mortem identified the untested-integration pattern and improvement issue #47 added e2e validation guidance to the project template. V0.3 adopted the guidance — the criterion was there — but it was never actually tested. POST requests returned 403 Forbidden due to missing CSRF token materialization (#21). The improvement from V0.2 was implemented as documentation but not enforced as practice.

**Staging was never tested.** OAuth2 login was broken in the staging environment because the nginx reverse proxy didn't send `X-Forwarded-*` headers, causing Spring Security to construct the OAuth2 `redirect_uri` from the internal Docker network address (`http://backend-staging:8080`) instead of the external address (`http://localhost:5174`). Google rejected the request. This was invisible in the development environment because development doesn't run behind a proxy.

**The CSRF design was documented but not implemented.** The V0.3 project definition describes the correct CSRF configuration — `CookieCsrfTokenRepository` with non-XOR `CsrfTokenRequestAttributeHandler` and `CsrfTokenMaterializingFilter` for eager token generation. The original implementation (#56/PR #66) did not include these components. The design was right; the implementation didn't follow through. This gap was not caught until #21, two days and an entire project (V0.4) later.

**Follow-up issues cascaded.** Fixing #13 (forwarded headers) required changing `application.yml`, which caused backend tests to fail due to Spring profile configuration inconsistencies, which created #18 (normalize profile configuration). Each fix unmasked the next problem. The three follow-ups (#13, #18, #21) were not independent failures — they formed a chain rooted in the same gap: the integrated system was never tested as a whole.

| Issue | Root Cause | Category |
|-------|-----------|----------|
| #13 | nginx sends no `X-Forwarded-*` headers; Spring constructs redirect_uri from internal address | Untested environment |
| #18 | Four different credential resolution strategies across profiles; test profile incompatible | Inconsistent design |
| #21 | CSRF token never materialized before first POST; design documented but not implemented | Untested integration |

### Recommendations

**The process exists. The failure is following it.** V0.2 identified the untested-integration pattern. V0.2 created improvement issue #47. V0.2's improvement was implemented (commit `3b44540`). V0.3 had the e2e exit criterion. V0.3 didn't verify it. Creating more process to address a process that isn't being followed is circular.

Two observations for future projects:

1. **Verify exit criteria against the staging environment, not just development.** Both #13 and #21 were invisible in the development environment. Development runs without a proxy and without realistic CSRF flows. If the e2e criterion had been tested against staging, both bugs would have been caught before sign-off.

2. **If the project design specifies a component, verify it exists in the implementation.** The CSRF section of the V0.3 project definition describes `CsrfTokenMaterializingFilter` and non-XOR `CsrfTokenRequestAttributeHandler`. Neither was in the codebase when the project was marked "Done." The design document was more complete than the implementation — a gap that PR review should have caught, but V0.3's PR reviews were destroyed in the data loss and cannot be examined.
