# Store

Redux Toolkit state management.

## Contents

- **index.ts**: Store configuration, `RootState` and `AppDispatch` types
- **hooks.ts**: Typed `useAppSelector` and `useAppDispatch` hooks
- **recipeSlice.ts**: Recipe state with reducers
- **userSlice.ts**: User state with reducers
- **actions.ts**: Dispatch wrappers for simple action calls

## Conventions

- **recipes**: `Record<string, Recipe>` — recipes indexed by ID
- **recipesLoaded**: `boolean` — whether recipes have been loaded
- **currentRecipeId**: `string | null` — currently selected recipe
- **loading**: `boolean` — async operation in progress
- **error**: `string | null` — operation-level error message
- **success**: `string | null` — success message (auto-dismisses after 4 seconds in Layout)
- **validationErrors**: `ValidationError[]` — field-level validation errors
- **submitting**: `boolean` — form submission in progress

## Usage

```typescript
import * as act from '../store/actions';

act.setLoading(true);
act.setCurrentRecipeId(id);
act.addRecipe(recipe);
```
