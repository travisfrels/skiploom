# Web

REST controllers and exception handling for HTTP interactions.

## Contents

- **HealthController.kt**: Health check endpoint (`GET /api/health`)
- **RecipeCommandController.kt**: Command endpoints for recipe mutations (`POST /api/commands/...`)
- **RecipeQueryController.kt**: Query endpoints for recipe reads (`GET /api/queries/...`)
- **ValidationExceptionHandler.kt**: `@ControllerAdvice` adding field-level `{field, message}` errors to validation ProblemDetail responses
- **E2eLoginController.kt**: E2E-only login endpoint (`POST /api/e2e/login`); synthesises an OAuth2 session for a fixed test user (`@Profile("e2e")` — not active in production)

## Conventions

- Controllers are thin delegation layers forwarding to use case classes — no business logic
- Command endpoints use `@Valid @RequestBody` to trigger Jakarta Bean Validation before use case execution
- Application exceptions extend `ResponseStatusException` for Spring's ProblemDetail support (RFC 7807)
- `ValidationExceptionHandler` strips command wrapper prefixes from field paths (e.g., `recipe.title` becomes `title`)

## Tested By

- `/test/**/infrastructure/web/**`