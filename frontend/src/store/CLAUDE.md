# Store

Redux Toolkit state management.

## Contents

- **index.ts**: Store configuration, RootState and AppDispatch types
- **hooks.ts**: Typed `useAppSelector` and `useAppDispatch` hooks
- **recipeSlice.ts**: Recipe state and reducers
- **actions.ts**: Dispatch wrappers for simple action calls

## State Shape

- **recipes**: `Record<string, Recipe>` Map of recipes indexed by ID
- **recipesLoaded**: `boolean` Have the recipes been loaded from the backend?
- **currentRecipeId**: `string | null` ID of the currently selected recipe
- **loading**: `boolean` Is an async operation in progress?
- **error**: `string | null` Error message from failed operations
- **validationErrors**: `ValidationError[]` Validation errors from backend commands
- **submitting**: `boolean` Is a form submission in progress?

## Reducers

- `setLoading`, `setError`: Async operation state
- `setRecipes`, `setRecipesLoaded`: Recipe list state
- `setCurrentRecipeId`, `clearCurrentRecipeId`: Selected recipe ID
- `addRecipe`, `updateRecipe`, `removeRecipe`: Mutate recipes map
- `setSubmitting`, `setValidationErrors`, `clearValidationErrors`: Form state

## Actions

Actions wrap dispatch calls with simple methods:

```typescript
import * as act from '../store/actions';

act.setLoading(true);
act.setCurrentRecipeId(id);
act.addRecipe(recipe);
```
