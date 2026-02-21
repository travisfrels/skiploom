# Query Tests

Unit tests for query use cases (`/main/**/application/queries/`) verifying orchestration, delegation, and error conditions.

## Contents

- **FetchAllRecipesTest.kt**: Tests for `FetchAllRecipes` (empty results, single recipe, multiple recipes)
- **FetchFeatureFlagsTest.kt**: Tests for `FetchFeatureFlags` (empty flags, single flag, multiple flags)
- **FetchRecipeByIdTest.kt**: Tests for `FetchRecipeById` (not-found, invalid ID, response with ID and message)

## Conventions

- Domain operation interfaces (`RecipeReader`, `FeatureReader`) are mocked with MockK
