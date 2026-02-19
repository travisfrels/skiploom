# Infrastructure Configuration

Configuration for infrastructure classes.

## Contents

- **E2eSecurityConfig.kt**: E2E-only security filter chain permitting unauthenticated access to `/api/e2e/**` and providing the `HttpSessionSecurityContextRepository` bean (`@Profile("e2e")` — not active in production)

## Tested By

- `/test/**/infrastructure/config/**`