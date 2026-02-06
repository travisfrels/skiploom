# API

HTTP client functions for backend communication.

## Contents

- **shared.ts**: `API_BASE_URL` constant, `postCommand` helper for POST+JSON commands, `handleResponse` for response/error parsing
- **commands.ts**: Command functions (`createRecipe`, `updateRecipe`, `deleteRecipe`) delegating to `postCommand`
- **queries.ts**: Query functions (`fetchAllRecipes`, `fetchRecipeById`)
- **index.ts**: Barrel re-export of commands and queries

## Conventions

- All responses routed through `handleResponse` which parses RFC 7807 ProblemDetail error bodies
- 400 responses with field-level `errors` throw `ValidationFailedError`
- Other error responses throw `Error` with the ProblemDetail `detail` message
- Base URL: `http://localhost:8080/api`

## Usage

```typescript
import * as api from '../api';
import { MyCommand, MyResponse } from '../types';

export async function myMethod(myCommand: MyCommand): Promise<MyResponse> {
  return await api.myRequest(myCommand);
}
```
