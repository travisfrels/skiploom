# Configuration Tests

Unit tests for infrastructure configuration (`/main/**/infrastructure/config/`).

## Contents

- **SecurityConfigTest.kt**: Tests security filter chain behavior — 401 for unauthenticated API requests, 302 redirect for unauthenticated admin/togglz requests, CSRF enforcement. Uses `InMemoryClientRegistrationRepository` with a test Google registration to enable OAuth2 redirect resolution.
- **UserPersistingAuthenticationSuccessHandlerTest.kt**: Tests user persistence on OAuth2 login (create new, update existing) and post-login redirect behavior.
