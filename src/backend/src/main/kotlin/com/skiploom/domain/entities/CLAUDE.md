# Entities

Core business objects with unique identities, defined as Kotlin data classes.

## Contents

- **Entities.kt**: Domain entity definitions (`Recipe`, `Ingredient`, `Step`)
- **RecipeCategory.kt**: Recipe category enum (`MAIN`, `SIDE`, `DESSERT`, `APPETIZER`, `SOUP`, `SALAD`, `BREAKFAST`, `SNACK`, `COCKTAIL`)
- **IdempotencyClaim.kt**: Idempotency claim entity for tracking processed idempotency keys
- **MealType.kt**: Meal type enum (BREAKFAST, BRUNCH, LUNCH, DINNER, SNACK)
- **MealPlanEntry.kt**: Meal plan entry entity connecting a user, date, meal type, and recipe or ad-hoc title
- **ShoppingList.kt**: Shopping list aggregate (`ShoppingList`, `ShoppingListItem`) for user-owned shopping lists with ordered, checkable items

## Conventions

- Implemented as immutable Kotlin data classes
- Companion objects declare `const val` limits and messages (e.g., `TITLE_MAX_LENGTH`, `TITLE_REQUIRED_MESSAGE`) for use in Jakarta Bean Validation annotations on DTOs
- No circular dependencies between entities
