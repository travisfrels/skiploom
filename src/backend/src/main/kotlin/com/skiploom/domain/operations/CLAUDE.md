# Operations

Interfaces defining all the ways to fetch or atomically mutate entities.

## Contents

- **FeatureReader.kt**: Read operations for checking feature flag state (single flag and bulk fetch)
- **RecipeReader.kt**: Read operations for fetching recipe data
- **RecipeWriter.kt**: Write operations for mutating recipe data
- **UserReader.kt**: Read operations for fetching user data
- **UserWriter.kt**: Write operations for mutating user data
- **IdempotencyClaimReader.kt**: Read operations for looking up idempotency claims by key
- **IdempotencyClaimWriter.kt**: Write operations for persisting idempotency claims
- **MealPlanEntryReader.kt**: Read operations for fetching meal plan entries by id or user/date range
- **MealPlanEntryWriter.kt**: Write operations for saving and deleting meal plan entries
- **ShoppingListReader.kt**: Read operations for fetching shopping lists by id or user
- **ShoppingListWriter.kt**: Write operations for saving and deleting shopping lists

## Conventions

- Operations that mutate state succeed or fail as an atomic unit
