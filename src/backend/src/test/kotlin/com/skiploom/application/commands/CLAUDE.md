# Command Tests

Unit tests for command use cases verifying orchestration, delegation, and error conditions.

## Contents

- **CreateRecipeTest.kt**: Tests for `CreateRecipe` (response shape, save delegation)
- **UpdateRecipeTest.kt**: Tests for `UpdateRecipe` (save delegation, response shape, not-found, invalid ID)
- **DeleteRecipeTest.kt**: Tests for `DeleteRecipe` (deletion, not-found, invalid ID, blank ID)

## Conventions

- Domain operation interfaces (`RecipeReader`, `RecipeWriter`) are mocked with MockK
