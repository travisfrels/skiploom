# Skiploom Frontend Operations

Orchestrate API calls and store mutations.

## Contents

- **index.ts**: Re-exports all operations

## Conventions

1. Clear validation errors and error state (for commands)
2. Set loading/submitting state to true
3. Call backend API via the API client
4. On success: mutate the entity state within the store and return a success indicator
5. On validation error: set validation errors in the store and return a failure indicator
6. On non-validation error: set error message in the store and return a failure indicator
7. Finally: Set loading/submitting state to false

Components call operations, operations handle exceptions and mutate state.

## Usage

```typescript
import * as ops from '../operations';

// Queries
ops.loadFeatureFlags();
ops.loadRecipes();
ops.loadRecipeById(id);
ops.setCurrentRecipeId(id);

// Commands
const id = await ops.createRecipe({ recipe });
if (id) navigate(`/recipes/${id}`);
```
