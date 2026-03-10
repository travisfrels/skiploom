# Command Tests

Unit tests for command use cases (`/main/**/application/commands/`) verifying orchestration, delegation, and error conditions.

## Contents

- **CreateRecipeTest.kt**: Tests for `CreateRecipe` (response shape, save delegation)
- **UpdateRecipeTest.kt**: Tests for `UpdateRecipe` (save delegation, response shape, not-found, invalid ID)
- **DeleteRecipeTest.kt**: Tests for `DeleteRecipe` (deletion, not-found, invalid ID, blank ID)
- **CreateMealPlanEntryTest.kt**: Tests for `CreateMealPlanEntry` (save delegation, response shape, id-not-allowed)
- **UpdateMealPlanEntryTest.kt**: Tests for `UpdateMealPlanEntry` (save delegation, response shape, not-found, wrong user, invalid ID)
- **DeleteMealPlanEntryTest.kt**: Tests for `DeleteMealPlanEntry` (deletion, not-found, wrong user, invalid ID, delete-returns-false)
- **CreateShoppingListTest.kt**: Tests for `CreateShoppingList` (save delegation, response shape, id-not-allowed)
- **UpdateShoppingListTest.kt**: Tests for `UpdateShoppingList` (save delegation, response shape, not-found, wrong user, invalid ID)
- **DeleteShoppingListTest.kt**: Tests for `DeleteShoppingList` (deletion, not-found, wrong user, invalid ID, delete-returns-false)

## Conventions

- Domain operation interfaces (`RecipeReader`, `RecipeWriter`) are mocked with MockK
