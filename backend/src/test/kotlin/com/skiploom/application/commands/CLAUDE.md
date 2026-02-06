# Command Tests

Unit tests for command use cases. Each test class verifies that the command orchestrates domain operations correctly,
including the happy path and error conditions.

Key Components and Responsibilities:

- **Happy Path**: Verifies that `execute` produces the expected `Response` and delegates to the correct domain operations.
- **Error Conditions**: Verifies that domain exceptions (`RecipeNotFoundException`, `InvalidRecipeIdException`) are thrown
  for invalid or missing data.

Characteristics:

- **Trust Dependencies**: Command tests verify orchestration decisions (delegation, preconditions, response shape), not
  dependency behaviors (mapping, trimming, sorting) which have their own test suites.
- **Mocked Dependencies**: Domain operation interfaces (`RecipeReader`, `RecipeWriter`) are mocked with MockK.
- **No Spring Context**: Tests instantiate command classes directly without a Spring application context.
- **Naming Convention**: Mock variables are named after their interface (`recipeReader`, `recipeWriter`).

## Contents

- **CreateRecipeTest.kt**: Tests for `CreateRecipe` (response shape, save delegation).
- **UpdateRecipeTest.kt**: Tests for `UpdateRecipe` (save delegation with response shape, not-found, invalid ID).
- **DeleteRecipeTest.kt**: Tests for `DeleteRecipe` (deletion, not-found, invalid ID, blank ID).
