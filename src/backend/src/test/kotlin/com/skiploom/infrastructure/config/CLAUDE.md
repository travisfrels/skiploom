# Configuration Tests

Unit tests for infrastructure configuration (`/main/**/infrastructure/config/`).

## Contents

- **SecurityConfigTest.kt**: Tests security filter chain behavior — 401 for unauthenticated API requests, 302 redirect for unauthenticated admin/togglz requests, public access to `/admin/account-disabled`, CSRF enforcement. Uses `InMemoryClientRegistrationRepository` with a test Google registration to enable OAuth2 redirect resolution.
- **TogglzConsoleNavigationFilterTest.kt**: Tests navigation bar injection into HTML responses (with and without body tag attributes), passthrough of non-HTML and redirect responses, and correct link text/href.
- **UserPersistingAuthenticationSuccessHandlerTest.kt**: Tests user persistence on OAuth2 login (create new, update existing), post-login redirect behavior, and disabled account enforcement (redirect to account-disabled page, no delegation to success handler).
