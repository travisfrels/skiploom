# Controller Tests

Unit tests for REST controllers verifying delegation and HTTP response behavior.

## Contents

- **RecipeCommandControllerTest.kt**: Tests for `RecipeCommandController` (create, update, delete via MockMvc)
- **RecipeQueryControllerTest.kt**: Tests for `RecipeQueryController` (fetch all, fetch by ID via MockMvc)
- **HealthControllerTest.kt**: Tests for `HealthController` (health endpoint via MockMvc)

## Conventions

- `@WebMvcTest` with `MockMvc` for routing and serialization; use case beans provided via `@TestConfiguration` with MockK mocks
- Verify controller delegation and HTTP response shape, not use case logic
