# ADR: Profile-Gated E2E Authentication Bypass

## Status

Accepted

## Context

Skiploom uses Google OAuth2 for authentication. E2E tests run against the full Docker Compose stack and require authenticated sessions to exercise recipe management flows. The real OAuth2 provider (Google) is unavailable in automated test environments — it requires browser-based interactive consent, rate-limits automated requests, and introduces an external dependency that would make tests flaky and non-deterministic.

An authentication mechanism was needed for E2E tests that:

- Provides authenticated sessions without an external OAuth2 provider
- Cannot accidentally activate in non-test environments
- Produces sessions indistinguishable from real OAuth2 sessions to the application
- Does not require test-specific database seeding or user management

Three alternatives were evaluated:

1. **Profile-gated auth bypass** — Spring `@Profile("e2e")` classes that synthesize OAuth2 sessions, activated via Docker Compose override
2. **Test user database seeding** — Pre-populate the database with test user records and use direct form login
3. **Mock OAuth2 provider** — Run a local OAuth2-compatible identity provider (e.g., Keycloak, mock-oauth2-server) as a Docker service

## Decision

We will use a **profile-gated authentication bypass** activated by the `e2e` Spring profile via a Docker Compose override file.

## Rationale

The profile-gated bypass was selected based on three criteria evaluated in order: impact, least astonishment, and idiomaticity.

| Criterion | Profile-Gated Bypass | Test User DB Seeding | Mock OAuth2 Provider |
|-----------|---------------------|---------------------|---------------------|
| Impact | High | Medium | High |
| Least Astonishment | High | Medium | Medium |
| Idiomaticity | High | Low | Medium |

**Why not test user database seeding?**

Requires maintaining a separate authentication path (form login) alongside OAuth2, doubling the security surface area. Test sessions would not exercise the same authentication token flow as production, reducing E2E test fidelity. Database seeding creates coupling between test setup and the user schema, breaking when the schema evolves.

**Why not a mock OAuth2 provider?**

Adds a Docker service to the test environment, increasing infrastructure complexity and startup time. Requires configuring and maintaining a separate identity provider (redirect URIs, client credentials, token issuance). Provides higher fidelity than the bypass approach but at disproportionate cost for a ~5-user application where the OAuth2 integration itself is not under active development.

## Design

The bypass consists of two `@Profile("e2e")`-gated classes and a Docker Compose override:

- **`E2eSecurityConfig`**: Registers a high-priority security filter chain scoped to `/api/e2e/**` that permits unauthenticated access and disables CSRF. Provides the `HttpSessionSecurityContextRepository` bean for session persistence.
- **`E2eLoginController`**: Exposes `POST /api/e2e/login`. Saves a fixed test user via the domain `UserWriter`, builds an `OAuth2AuthenticationToken` backed by a synthetic OIDC ID token, and stores the security context in the HTTP session. The caller receives a session cookie.
- **`compose.e2e.yml`**: Overrides the backend service to set `SPRING_PROFILES_ACTIVE: staging,e2e`, activating the bypass alongside staging configuration.

### Alternatives not chosen (Design)

- **Single bypass class**: Combining security config and login controller into one class would mix concerns (filter chain registration and request handling). Two focused classes follow single-responsibility.
- **Token-based bypass (no session)**: Returning a bearer token instead of a session cookie would diverge from the production auth flow, which uses session-based OAuth2. Session cookies maintain test fidelity.

## Consequences

**Positive:**

- Zero external dependencies — no additional Docker services or OAuth2 providers
- Sessions are indistinguishable from real OAuth2 sessions to the application layer
- `@Profile("e2e")` guarantees the bypass classes never load in development, staging, or production
- The `/api/e2e/**` namespace is isolated from production API routes
- Compose override only applies when explicitly included (`-f compose.e2e.yml`)

**Negative:**

- Does not exercise the real OAuth2 redirect flow — bugs in the OAuth2 integration itself would not be caught by E2E tests
- The synthetic OIDC ID token uses hardcoded claims that may drift from real Google token claims over time
- Two additional Spring components exist in the codebase that are inert in all non-e2e environments

**Neutral:**

- The bypass pattern is an E2E-specific concern; unit and integration tests continue to use Spring Security's test support (`@WithMockUser`, `SecurityMockServerConfigurers`)
