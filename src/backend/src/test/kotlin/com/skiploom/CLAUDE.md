# Skiploom Tests

The skiploom application test files.

## Directory Structure

- `application/`: Command, querie, DTO, and validator tests
- `infrastructure/`: Operation and controller tests

## Coding Standards

- Unit tests run without Spring context unless noted otherwise (e.g., controller tests use `@WebMvcTest`)
- Use case tests verify orchestration (delegation, preconditions, response shape), not dependency behaviors
- Mock variables named after the dependency they replace (e.g., `recipeReader`, `createRecipe`)
