# Infrastructure Configuration

Configuration for infrastructure classes.

## Contents

- **CsrfTokenMaterializingFilter.kt**: Filter that materializes CSRF token attribute for JavaScript access
- **E2eSecurityConfig.kt**: E2E-only security filter chain permitting unauthenticated access to `/api/e2e/**` and providing the `HttpSessionSecurityContextRepository` bean (`@Profile("e2e")` — not active in production)
- **SecurityConfig.kt**: Main security filter chain — `/api/**` returns 401 for unauthenticated requests; `/admin/**` and `/togglz-console/**` redirect to OAuth2 login; uses `SavedRequestAwareAuthenticationSuccessHandler` so post-login redirects return to the originally requested URL
- **SkiploomFeatures.kt**: Togglz feature enum defining available feature flags
- **TogglzConfig.kt**: Togglz configuration providing `JDBCStateRepository` bean backed by PostgreSQL

## Tested By

- `/test/**/infrastructure/config/**`