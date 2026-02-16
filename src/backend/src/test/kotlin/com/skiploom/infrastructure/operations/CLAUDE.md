# Operations Tests

Unit tests for infrastructure operation implementations (`/main/**/infrastructure/operations/`).

## Contents

- **PostgresRecipeRepositoryTest.kt**: Integration tests for `PostgresRecipeRepository` (fetch, exists, save, delete)

## Conventions

- Test concrete repository classes directly without mocking
