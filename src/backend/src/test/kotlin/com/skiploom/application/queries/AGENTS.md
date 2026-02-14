# Query Tests

Unit tests for query use cases verifying orchestration, delegation, and error conditions.

## Contents

- **FetchAllRecipesTest.kt**: Tests for `FetchAllRecipes` (empty results, single recipe, multiple recipes)
- **FetchRecipeByIdTest.kt**: Tests for `FetchRecipeById` (not-found, invalid ID, response with ID and message)

## Conventions

- Domain operation interfaces (`RecipeReader`) are mocked with MockK
