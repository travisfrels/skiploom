# V0.3 Operational Authentication

| Status | Created | Updated |
|--------|---------|---------|
| Done | 2026-02-14 | 2026-02-15 |

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

Spring Security enables CSRF protection by default. Session-cookie authentication with a same-origin SPA requires a CSRF strategy — either synchronizer tokens via `CookieCsrfTokenRepository` or disabling CSRF for API endpoints and relying on `SameSite` cookie attributes. The specific approach should be decided during implementation.

## Exit Criteria

- [ ] `spring-boot-starter-oauth2-client` added as a dependency
- [ ] Google OAuth2 client ID and secret configured per Spring profile
- [ ] `SecurityFilterChain` requires authentication on all `/api/**` endpoints
- [ ] OAuth2 login redirects to Google and back to the application on success
- [ ] `user` table created via Flyway migration (id, google_subject, email, display_name)
- [ ] User record created or updated on first/subsequent login
- [ ] `/api/me` endpoint returns the authenticated user's identity
- [ ] Frontend detects 401 and redirects to login
- [ ] Frontend displays the authenticated user's name
- [ ] Unauthenticated request to any API endpoint returns 401
- [ ] Authenticated user can browse, create, edit, and delete recipes end-to-end through the UI
- [ ] Post-login redirect returns user to the frontend root, not a saved API request (#70)
- [ ] OAuth2 configuration documented with startup validation for missing credentials (#69)

## References

- [Issue #54: Add V0.3 Authentication project definition](http://localhost:3000/skiploom-agent/skiploom/issues/54)
- [Issue #56: Add Spring Security OAuth2 and SecurityFilterChain](http://localhost:3000/skiploom-agent/skiploom/issues/56)
- [Issue #57: Add user persistence and /api/me endpoint](http://localhost:3000/skiploom-agent/skiploom/issues/57)
- [Issue #58: Add frontend authentication handling](http://localhost:3000/skiploom-agent/skiploom/issues/58)

### Follow-Up Issues

- [Issue #69: Add OAuth2 configuration documentation and startup validation](http://localhost:3000/skiploom-agent/skiploom/issues/69)
- [Issue #70: Fix post-login redirect to frontend root](http://localhost:3000/skiploom-agent/skiploom/issues/70)

### Pull Requests

- [PR #55: #54 Add V0.3 Authentication project definition](http://localhost:3000/skiploom-agent/skiploom/pulls/55)
- [PR #66: #56 Add Spring Security OAuth2 and SecurityFilterChain](http://localhost:3000/skiploom-agent/skiploom/pulls/66)
- [PR #67: #57 Add user persistence and /api/me endpoint](http://localhost:3000/skiploom-agent/skiploom/pulls/67)
- [PR #68: #58 Add frontend authentication handling](http://localhost:3000/skiploom-agent/skiploom/pulls/68)
