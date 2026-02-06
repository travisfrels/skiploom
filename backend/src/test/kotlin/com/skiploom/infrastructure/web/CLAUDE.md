# Controller Tests

Unit tests for REST controllers. Each test class verifies that the controller delegates to the correct use case and
returns the expected HTTP response.

Key Components and Responsibilities:

- **Delegation**: Verifies that controller methods forward to the correct command or query use case.
- **HTTP Response**: Verifies status codes and response body shape.
- **Error Propagation**: Verifies that application exceptions propagate through the controller unchanged.

Characteristics:

- **@WebMvcTest with MockMvc**: All controller tests use `@WebMvcTest` with `MockMvc` to exercise routing and
  serialization. Use case beans are provided via `@TestConfiguration` inner classes returning MockK mocks.
- **Mocked Dependencies**: Use case classes (`CreateRecipe`, `UpdateRecipe`, `DeleteRecipe`, `FetchAllRecipes`,
  `FetchRecipeById`) are mocked — controller tests do not exercise use case logic.
- **Naming Convention**: Mock variables are named after their use case class (`createRecipe`, `fetchAllRecipes`).

## Contents

- **RecipeCommandControllerTest.kt**: Tests for `RecipeCommandController` (create, update, delete response and error
  propagation via MockMvc).
- **RecipeQueryControllerTest.kt**: Tests for `RecipeQueryController` (fetch all, fetch by ID via MockMvc).
- **HealthControllerTest.kt**: Tests for `HealthController` (health endpoint status via MockMvc).
