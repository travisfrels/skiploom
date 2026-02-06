# Operations Tests

Unit tests for **Infrastructure Layer** operation implementations. Each test class corresponds to a concrete repository
and verifies that CRUD operations, seed data, and edge cases behave correctly.

Key Components and Responsibilities:

- **CRUD Correctness**: Verifies that `fetchAll`, `fetchById`, `exists`, `save`, and `delete` behave as expected.
- **Seed Data Verification**: Tests that repositories are initialized with the expected seed data.
- **Edge Cases**: Verifies behavior for non-existent IDs, duplicate saves, and delete-of-absent entries.

Characteristics:

- **Concrete Class Testing**: Tests instantiate the repository directly without mocking, exercising the real
  implementation.
- **No Spring Context**: Tests run without a Spring application context.

## Contents

- **InMemoryRecipeRepositoryTest.kt**: Tests for `InMemoryRecipeRepository` (seed data, fetch, exists, save, delete).
