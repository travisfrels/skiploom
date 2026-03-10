# DTOs

Data transfer objects with bidirectional entity mapping.

## Contents

- **Ordered.kt**: Interface declaring `val orderIndex: Int`, implemented by `IngredientDto` and `StepDto`
- **IngredientDto.kt**: DTO and mapping for `Ingredient`
- **RecipeDto.kt**: DTO and mapping for `Recipe`, including `String.toRecipeId()` UUID parsing
- **StepDto.kt**: DTO and mapping for `Step`
- **MealPlanEntryDto.kt**: DTO and mapping for `MealPlanEntry`, including `String.toMealPlanEntryId()` UUID parsing and `String.toRecipeId()` for recipe ID parsing
- **ShoppingListDto.kt**: DTO and mapping for `ShoppingList`, including `String.toShoppingListId()` UUID parsing, `toDto()`, and `toSummaryDto()` (without items)
- **ShoppingListItemDto.kt**: DTO and mapping for `ShoppingListItem`

## Conventions

- Implemented as immutable Kotlin data classes with `val` properties
- Jakarta Bean Validation annotations (`@NotBlank`, `@Size`, `@DecimalMin`, `@Valid`, `@NotEmpty`, `@ContiguousOrder`) reference `const val` limits and messages from entity companion objects
- `toDomain()` trims string fields, normalizes blank optional fields to `null`, and sorts collections by `orderIndex`
- `toDto()` sorts collections by `orderIndex`
