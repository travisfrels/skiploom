# API Layer

HTTP client functions for backend communication.

## Contents

- **recipeApi.ts**: All API calls related to recipes

## Structure

- Query functions: `fetchAllRecipes`, `fetchRecipeById`
- Command functions: `createRecipe`, `updateRecipe`, `deleteRecipe`
- Types mirror backend DTOs: `CreateRecipeCommand`, `UpdateRecipeCommand`, etc.
- `ValidationFailedError` - Thrown on 400 responses with validation errors

## Conventions

- Functions are async, return typed responses
- 400 responses throw `ValidationFailedError`
- 404 responses throw generic `Error`
- Base URL: `http://localhost:8080/api`

## Usage

```typescript
import * as api from '../api/recipeApi';
import { MyCommand, MyResponse } from '../types';

export async function myMethod(myCommand: MyCommand): Promise<MyResponse> {
  return await api.myRequest(myCommand);
}
```
