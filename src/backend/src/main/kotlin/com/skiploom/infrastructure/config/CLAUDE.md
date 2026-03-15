# Infrastructure Configuration

Configuration for infrastructure classes.

## Contents

- **CsrfTokenMaterializingFilter.kt**: Filter that materializes CSRF token attribute for JavaScript access
- **E2eSecurityConfig.kt**: E2E-only security filter chain permitting unauthenticated access to `/api/e2e/**` and providing the `HttpSessionSecurityContextRepository` bean (`@Profile("e2e")` — not active in production)
- **SecurityConfig.kt**: Main security filter chain — `/api/**` returns 401 for unauthenticated requests; `/admin/**` and `/togglz-console/**` redirect to OAuth2 login; `/admin/account-disabled` is public (accessible without authentication); uses `SavedRequestAwareAuthenticationSuccessHandler` so post-login redirects return to the originally requested URL
- **UserPersistingAuthenticationSuccessHandler.kt**: Persists user on OAuth2 login (create new or update existing) and enforces disabled account check — redirects disabled users to `/admin/account-disabled` without establishing an authenticated session
- **SkiploomFeatures.kt**: Togglz feature enum defining available feature flags
- **TogglzConfig.kt**: Togglz configuration providing `JDBCStateRepository` bean backed by PostgreSQL and `FilterRegistrationBean` for the Togglz console navigation filter
- **TogglzConsoleNavigationFilter.kt**: Servlet filter that injects a "Back to Admin" navigation bar into Togglz console HTML responses; scoped to `/togglz-console/*` via `FilterRegistrationBean` in `TogglzConfig`

## Tested By

- `/test/**/infrastructure/config/**`