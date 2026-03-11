# Store

Redux Toolkit state management.

## Contents

- **index.ts**: Store configuration, `RootState` and `AppDispatch` types
- **hooks.ts**: Typed `useAppSelector` and `useAppDispatch` hooks
- **featureFlagSlice.ts**: Feature flag state with reducers
- **mealPlanSlice.ts**: Meal plan entry state with reducers
- **notificationSlice.ts**: Error and success notification state with reducers
- **recipeSlice.ts**: Recipe state with reducers
- **shoppingListSlice.ts**: Shopping list state with reducers
- **userSlice.ts**: User state with reducers
- **actions.ts**: Dispatch wrappers for simple action calls

## Conventions

- **featureFlags**: `Record<string, boolean>` — feature flags indexed by name
- **featureFlagsLoaded**: `boolean` — whether feature flags have been loaded
- **recipes**: `Record<string, Recipe>` — recipes indexed by ID
- **recipesLoaded**: `boolean` — whether recipes have been loaded
- **currentRecipeId**: `string | null` — currently selected recipe
- **loading**: `boolean` — async operation in progress
- **validationErrors**: `ValidationError[]` — field-level validation errors
- **submitting**: `boolean` — form submission in progress

### notificationSlice

- **error**: `string | null` — operation-level error message (rendered by Layout as dismissible red banner)
- **success**: `string | null` — success message (rendered by Layout as dismissible green banner, auto-dismisses after 4 seconds)

### mealPlanSlice

- **entries**: `Record<string, MealPlanEntry>` — meal plan entries indexed by ID
- **entriesLoaded**: `boolean` — whether entries have been loaded
- **loading**: `boolean` — async operation in progress
- **validationErrors**: `ValidationError[]` — field-level validation errors
- **submitting**: `boolean` — form submission in progress

### shoppingListSlice

- **lists**: `Record<string, ShoppingList>` — shopping lists indexed by ID
- **listsLoaded**: `boolean` — whether lists have been loaded
- **currentListId**: `string | null` — currently selected shopping list
- **loading**: `boolean` — async operation in progress
- **validationErrors**: `ValidationError[]` — field-level validation errors
- **submitting**: `boolean` — form submission in progress

## Usage

```typescript
import * as act from '../store/actions';

act.setLoading(true);
act.setCurrentRecipeId(id);
act.addRecipe(recipe);
```

## Testing

- New slices must have a corresponding `<sliceName>.test.ts` file from the first commit (TDD).
- Use existing slice test files as templates (e.g., `recipeSlice.test.ts`, `mealPlanSlice.test.ts`).
- Test coverage for a new slice should have parity with peer slices: initial state, each reducer, and edge cases.
