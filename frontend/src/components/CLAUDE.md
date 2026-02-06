# Components

React functional components with hooks.

## Contents

- **Layout.tsx**: App shell with header, dismissible error banner, auto-dismissing success banner, and main content area
- **Home.tsx**: Landing page
- **Recipes.tsx**: Recipe list page, loads recipes on mount
- **RecipeList.tsx**: Grid of recipe cards
- **RecipeCard.tsx**: Single recipe preview card
- **RecipeDetail.tsx**: Full recipe view with edit/delete actions
- **RecipeForm.tsx**: Create/edit recipe form
- **IngredientList.tsx**: Displays ingredients
- **StepList.tsx**: Displays steps

## Conventions

- Use `useAppSelector` (`import { useAppSelector } from '../store/hooks';`) to read state
- Leverage operations (`import * as ops`) for orchestrating API calls and mutating state
- Components are responsible for rendering state, not orchestrating API calls or mutating state
- Operation-level errors (`state.recipes.error`) are rendered exclusively by `Layout.tsx` as a dismissible red banner — individual page components do not read or render this state
- Success messages (`state.recipes.success`) are rendered exclusively by `Layout.tsx` as a dismissible green banner that auto-dismisses after 4 seconds
- Validation errors (`state.recipes.validationErrors`) are rendered inline by `RecipeForm.tsx` per field
