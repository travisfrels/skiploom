# Operations

State mutation orchestration functions that bridge API and store.

## Contents

- **loadRecipes.ts**: Fetch all recipes from the backend
- **loadRecipeById.ts**: Fetch a single recipe by ID and set it as current
- **setCurrentRecipeId.ts**: Set the current recipe ID (no API call)
- **createRecipe.ts**: Create a new recipe
- **updateRecipe.ts**: Update an existing recipe
- **deleteRecipe.ts**: Delete a recipe
- **index.ts**: Re-exports all operations

## Pattern

1. Clear validation errors (for create/update)
2. Set loading/submitting state to true
3. Call backend API via the API client
4. On success: mutate the entity state within the store and return a success indicator
5. On validation error: mutate the validation state within the store and return a failure indicator
6. Finally: Set loading/submitting state to false

## Usage

```typescript
import * as ops from '../operations';

// Queries
ops.loadRecipes();
ops.loadRecipeById(id);
ops.setCurrentRecipeId(id);

// Commands
const id = await ops.createRecipe({ recipe });
if (id) navigate(`/recipes/${id}`);
```

Components call operations, operations handle exceptions and mutate state.
