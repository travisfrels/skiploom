# Web Tests

Unit tests for web layer components (`/main/**/infrastructure/web/`) verifying delegation and HTTP response behavior.

## Contents

- **E2eFeatureFlagControllerTest.kt**: Tests for `E2eFeatureFlagController` (feature flag toggling via MockMvc)
- **E2eLoginControllerTest.kt**: Tests for `E2eLoginController` (E2E login endpoint via MockMvc)
- **FeatureFlagQueryControllerTest.kt**: Tests for `FeatureFlagQueryController` (fetch feature flags via MockMvc)
- **HealthControllerTest.kt**: Tests for `HealthController` (health endpoint via MockMvc)
- **MeControllerTest.kt**: Tests for `MeController` (authenticated user endpoint via MockMvc)
- **RecipeCommandControllerTest.kt**: Tests for `RecipeCommandController` (create, update, delete via MockMvc)
- **RecipeQueryControllerTest.kt**: Tests for `RecipeQueryController` (fetch all, fetch by ID via MockMvc)
- **MealPlanEntryCommandControllerTest.kt**: Tests for `MealPlanEntryCommandController` (create, update, delete via MockMvc with OIDC auth)
- **MealPlanEntryQueryControllerTest.kt**: Tests for `MealPlanEntryQueryController` (fetch by date range, fetch by ID via MockMvc with OIDC auth)
- **ShoppingListCommandControllerTest.kt**: Tests for `ShoppingListCommandController` (create, update, delete via MockMvc with OIDC auth)
- **ShoppingListQueryControllerTest.kt**: Tests for `ShoppingListQueryController` (fetch all, fetch by ID via MockMvc with OIDC auth)
- **OidcUserResolverTest.kt**: Tests for `resolveUserId` extension function (happy path and not-found behavior via MockK)

## Conventions

- `@WebMvcTest` with `MockMvc` for routing and serialization; use case beans provided via `@TestConfiguration` with MockK mocks
- Verify controller delegation and HTTP response shape, not use case logic
