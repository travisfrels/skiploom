# Commands

Use cases that atomically mutate system state, each as a standalone `@Service` class.

## Contents

- **CreateRecipe.kt**: Creates a new recipe
- **UpdateRecipe.kt**: Updates an existing recipe, verifying existence first
- **DeleteRecipe.kt**: Deletes a recipe by ID
- **CreateMealPlanEntry.kt**: Creates a new meal plan entry for the authenticated user
- **UpdateMealPlanEntry.kt**: Updates an existing meal plan entry, verifying ownership
- **DeleteMealPlanEntry.kt**: Deletes a meal plan entry by ID, verifying ownership
- **CreateShoppingList.kt**: Creates a new shopping list for the authenticated user
- **UpdateShoppingList.kt**: Updates an existing shopping list, verifying ownership
- **DeleteShoppingList.kt**: Deletes a shopping list by ID, verifying ownership

## Conventions

- Uniform shape: nested `Command` input and `Response` output with `execute(command: Command): Response`
- Input validation declared on `Command` fields via `@Valid`
