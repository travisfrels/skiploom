import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import recipeReducer from '../store/recipeSlice';
import type { Recipe, RecipeSummary } from '../types';

interface RecipeState {
  recipeSummaries: RecipeSummary[];
  recipesLoaded: boolean;
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

interface RenderOptions {
  preloadedState?: {
    recipes: Partial<RecipeState>;
  };
  initialEntries?: string[];
}

const defaultRecipeState: RecipeState = {
  recipeSummaries: [],
  recipesLoaded: false,
  currentRecipe: null,
  loading: false,
  error: null,
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    initialEntries = ['/'],
  }: RenderOptions = {}
) {
  const mergedState = preloadedState
    ? {
        recipes: { ...defaultRecipeState, ...preloadedState.recipes },
      }
    : undefined;

  const store = configureStore({
    reducer: {
      recipes: recipeReducer,
    },
    preloadedState: mergedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
