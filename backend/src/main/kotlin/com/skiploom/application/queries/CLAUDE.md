# Queries

Use cases that fetch information from system state without mutation. Each query is a standalone `@Service` class
following the use-case-per-class pattern with a uniform `execute(query): response` shape.

Key Components and Responsibilities:

- **Query Data Class**: Nested input type defining the data required to execute the query. Parameterless queries use an
  `object Query` singleton.
- **Response Data Class**: Nested output type defining the data returned after execution.
- **Execute Method**: Single entry point that orchestrates the read via domain operation interfaces.

Characteristics:

- **Uniform Shape**: Every query defines a nested `Query` input and `Response` output with a single
  `execute(query: Query): Response` method.
- **Naming Convention**: Domain operation dependencies are named after their interface (`recipeReader`).
- **Domain Dependency Only**: Queries depend on domain operation interfaces, never on infrastructure.
- **Read Only**: Queries never mutate system state.

## Contents

- **FetchAllRecipes.kt**: Fetches all recipes.
- **FetchRecipeById.kt**: Fetches a single recipe by ID.
