# Types

TypeScript interfaces.

## Contents

- **dtos.ts**: Data transfer objects to transport data between the backend and frontend
- **entities.ts**: Domain entity definitions
- **index.ts**: Consolidate type exports

## Entities

- `Recipe`: Represents a recipe
- `Ingredient`: Represents an ingredient
- `Step`: Represents a step

## DTOs

- `ValidationError`: An individual validation error associated with an entity property
- `BadRequestResponse`: Represents a `400 BAD REQUEST` response from the backend API
- `ValidationFailedError`: Extends `Error` to represent the failure to validate a backend API request
- `FetchAllRecipesResponse`: Response from the `FetchAllRecipes` query
- `FetchRecipeByIdQuery`: Parameters to the `FetchRecipeById` query
- `FetchRecipeByIdResponse`: Response from the `FetchRecipeById` query
- `CreateRecipeCommand`: Parameters to the `CreateRecipe` command
- `CreateRecipeResponse`: Response from the `CreateRecipe` command
- `UpdateRecipeCommand`: Parameters to the `UpdateRecipe` command
- `UpdateRecipeResponse`: Response from the `UpdateRecipe` command
- `DeleteRecipeCommand`: Parameters to the `DeleteRecipe` command
- `DeleteRecipeResponse`: Response from the `DeleteRecipe` command

## Usage

```typescript
import type {
    /* Required types go here... */
} from '../types';
```
