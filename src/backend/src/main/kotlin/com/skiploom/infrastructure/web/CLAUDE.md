# Web

REST controllers and exception handling for HTTP interactions.

## Contents

- **AdminController.kt**: Server-rendered admin pages (`GET /admin/`, `GET /admin/account-disabled`, `GET /admin/users`, `POST /admin/users/{id}/toggle-enabled`); uses `@Controller` with Thymeleaf views, separate from REST API controllers
- **FeatureFlagQueryController.kt**: Query endpoint for feature flag state (`GET /api/queries/fetch_feature_flags`)
- **HealthController.kt**: Health check endpoint (`GET /api/health`)
- **MeController.kt**: Authenticated user endpoint (`GET /api/me`); returns current user profile from OIDC principal
- **RecipeCommandController.kt**: Command endpoints for recipe mutations (`POST /api/commands/...`); `create_recipe` enforces idempotency via optional `Idempotency-Key` header and claim persistence
- **RecipeQueryController.kt**: Query endpoints for recipe reads (`GET /api/queries/...`)
- **MealPlanEntryCommandController.kt**: Command endpoints for meal plan entry mutations (`POST /api/commands/...`); resolves user from OIDC principal
- **MealPlanEntryQueryController.kt**: Query endpoints for meal plan entry reads (`GET /api/queries/fetch_meal_plan_entries`, `GET /api/queries/fetch_meal_plan_entry_by_id/{id}`); resolves user from OIDC principal
- **ShoppingListCommandController.kt**: Command endpoints for shopping list mutations (`POST /api/commands/create_shopping_list`, `update_shopping_list`, `delete_shopping_list`); resolves user from OIDC principal
- **ShoppingListQueryController.kt**: Query endpoints for shopping list reads (`GET /api/queries/fetch_shopping_lists`, `GET /api/queries/fetch_shopping_list_by_id/{id}`); resolves user from OIDC principal
- **OidcUserResolver.kt**: Kotlin extension function on `UserReader` that resolves the authenticated user's ID from an `OidcUser` principal; throws 404 if user not found
- **ValidationExceptionHandler.kt**: `@ControllerAdvice` adding field-level `{field, message}` errors to validation ProblemDetail responses
- **E2eFeatureFlagController.kt**: E2E-only feature flag toggle endpoint (`POST /api/e2e/feature-flags/{featureName}`); enables or disables a feature flag via `FeatureManager` (`@Profile("e2e")` — not active in production)
- **E2eLoginController.kt**: E2E-only login endpoint (`POST /api/e2e/login`); preserves existing user's `enabled` state and returns 403 if disabled, otherwise synthesises an OAuth2 session for a fixed test user (`@Profile("e2e")` — not active in production)

## Conventions

- Controllers are thin delegation layers forwarding to use case classes — no business logic
- Command endpoints use `@Valid @RequestBody` to trigger Jakarta Bean Validation before use case execution
- Application exceptions extend `ResponseStatusException` for Spring's ProblemDetail support (RFC 7807)
- `ValidationExceptionHandler` strips command wrapper prefixes from field paths (e.g., `recipe.title` becomes `title`)

## Tested By

- `/test/**/infrastructure/web/**`