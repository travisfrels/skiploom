# Query Tests

Unit tests for query use cases. Each test class verifies that the query orchestrates domain read operations correctly,
including the happy path and error conditions.

Key Components and Responsibilities:

- **Happy Path**: Verifies that `execute` returns the expected `Response` with the correct entities by ID and message.
- **Error Conditions**: Verifies that domain exceptions (`RecipeNotFoundException`, `InvalidRecipeIdException`) are thrown
  for invalid or missing data.
- **Response Shape**: Verifies that the response contains the right entities (by ID) and message, not that every DTO field
  was mapped correctly (which is tested in DTO tests).

Characteristics:

- **Trust Dependencies**: Query tests verify orchestration decisions (delegation, preconditions, response shape), not
  dependency behaviors (mapping, trimming, sorting) which have their own test suites.
- **Mocked Dependencies**: Domain operation interfaces (`RecipeReader`) are mocked with MockK.
- **No Spring Context**: Tests instantiate query classes directly without a Spring application context.
- **Naming Convention**: Mock variables are named after their interface (`recipeReader`).

## Contents

- **FetchAllRecipesTest.kt**: Tests for `FetchAllRecipes` (empty results, single recipe by ID, multiple recipes by ID).
- **FetchRecipeByIdTest.kt**: Tests for `FetchRecipeById` (not-found, invalid ID, response with ID and message).
