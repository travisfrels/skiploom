# Operations Tests

Unit tests for infrastructure operation implementations (`/main/**/infrastructure/operations/`).

## Contents

- **PostgresRecipeRepositoryTest.kt**: Integration tests for `PostgresRecipeRepository` (fetch, exists, save, delete)
- **PostgresIdempotencyClaimRepositoryTest.kt**: Integration tests for `PostgresIdempotencyClaimRepository` (findByKey, save, update)
- **TogglzFeatureReaderTest.kt**: Integration tests for `TogglzFeatureReader` (enabled, disabled, unknown feature)

## Conventions

- Test concrete repository classes directly without mocking
