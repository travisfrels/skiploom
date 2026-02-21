# Operations

Concrete implementations of domain operation interfaces using specific persistence technologies.

## Contents

- **PostgresRecipeRepository.kt**: JPA-based implementation of `RecipeReader` and `RecipeWriter` for recipe persistence
- **PostgresUserRepository.kt**: JPA-based implementation of `UserReader` and `UserWriter` for user persistence
- **TogglzFeatureReader.kt**: Togglz-based implementation of `FeatureReader` for checking feature flag state

## Technologies

- Spring Data JPA
- Togglz

## Tested By

- `/test/**/infrastructure/operations/**`