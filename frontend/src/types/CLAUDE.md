# Types

TypeScript interfaces for entities, commands, queries, and errors.

## Contents

- **entities.ts**: Domain entity definitions (`Recipe`, `Ingredient`, `Step`)
- **errors.ts**: Error types (`ValidationError`, `ProblemDetailResponse`, `ValidationFailedError`)
- **commands.ts**: Command DTOs (`CreateRecipeCommand/Response`, `UpdateRecipeCommand/Response`, `DeleteRecipeCommand/Response`)
- **queries.ts**: Query DTOs (`FetchAllRecipesResponse`, `FetchRecipeByIdQuery/Response`)
- **index.ts**: Consolidated type exports

## Usage

```typescript
import type {
    /* Required types go here... */
} from '../types';
```
