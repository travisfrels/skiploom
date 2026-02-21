# Operations

Interfaces defining all the ways to fetch or atomically mutate entities.

## Contents

- **FeatureReader.kt**: Read operations for checking feature flag state (single flag and bulk fetch)
- **RecipeReader.kt**: Read operations for fetching recipe data
- **RecipeWriter.kt**: Write operations for mutating recipe data
- **UserReader.kt**: Read operations for fetching user data
- **UserWriter.kt**: Write operations for mutating user data

## Conventions

- Operations that mutate state succeed or fail as an atomic unit
