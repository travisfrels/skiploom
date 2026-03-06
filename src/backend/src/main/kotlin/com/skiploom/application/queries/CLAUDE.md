# Queries

Use cases that fetch information without mutation, each as a standalone `@Service` class.

## Contents

- **FetchAllRecipes.kt**: Fetches all recipes
- **FetchFeatureFlags.kt**: Fetches all feature flags with their enabled/disabled state
- **FetchRecipeById.kt**: Fetches a single recipe by ID
- **FetchMealPlanEntries.kt**: Fetches meal plan entries by user ID and date range
- **FetchMealPlanEntryById.kt**: Fetches a single meal plan entry by ID with user ownership check

## Conventions

- Uniform shape: nested `Query` input and `Response` output with `execute(query: Query): Response`
- Parameterless queries use an `object Query` singleton
