# Queries

Use cases that fetch information without mutation, each as a standalone `@Service` class.

## Contents

- **FetchAllRecipes.kt**: Fetches all recipes
- **FetchRecipeById.kt**: Fetches a single recipe by ID

## Conventions

- Uniform shape: nested `Query` input and `Response` output with `execute(query: Query): Response`
- Parameterless queries use an `object Query` singleton
