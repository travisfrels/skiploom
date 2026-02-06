# Web

REST controllers and exception handling for HTTP interactions.

## Contents

- **HealthController.kt**: Health check endpoint (`GET /api/health`)
- **RecipeCommandController.kt**: Command endpoints for recipe mutations (`POST /api/commands/...`)
- **RecipeQueryController.kt**: Query endpoints for recipe reads (`GET /api/queries/...`)
- **ValidationExceptionHandler.kt**: `@ControllerAdvice` adding field-level `{field, message}` errors to validation ProblemDetail responses

## Conventions

- Controllers are thin delegation layers forwarding to use case classes — no business logic
- Command endpoints use `@Valid @RequestBody` to trigger Jakarta Bean Validation before use case execution
- Application exceptions extend `ResponseStatusException` for Spring's ProblemDetail support (RFC 7807)
- `ValidationExceptionHandler` strips command wrapper prefixes from field paths (e.g., `recipe.title` becomes `title`)
