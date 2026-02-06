import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../store';
import * as slice from '../store/recipeSlice';
import type { Recipe, ValidationError } from '../types';

interface RecipeState {
  recipes: Record<string, Recipe>;
  recipesLoaded: boolean;
  currentRecipeId: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  validationErrors: ValidationError[];
  submitting: boolean;
}

interface RenderOptions {
  preloadedState?: {
    recipes: Partial<RecipeState>;
  };
  initialEntries?: string[];
}

function resetStore() {
  store.dispatch(slice.setRecipes([]));
  store.dispatch(slice.setRecipesLoaded(false));
  store.dispatch(slice.setCurrentRecipeId(null));
  store.dispatch(slice.setLoading(false));
  store.dispatch(slice.setError(null));
  store.dispatch(slice.setSuccess(null));
  store.dispatch(slice.setValidationErrors([]));
  store.dispatch(slice.setSubmitting(false));
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    initialEntries = ['/'],
  }: RenderOptions = {}
) {
  // Reset and populate the global store
  resetStore();

  if (preloadedState?.recipes) {
    const state = preloadedState.recipes;
    if (state.recipes) {
      const recipesArray = Object.values(state.recipes);
      store.dispatch(slice.setRecipes(recipesArray));
    }
    if (state.recipesLoaded !== undefined) {
      store.dispatch(slice.setRecipesLoaded(state.recipesLoaded));
    }
    if (state.currentRecipeId !== undefined) {
      store.dispatch(slice.setCurrentRecipeId(state.currentRecipeId));
    }
    if (state.loading !== undefined) {
      store.dispatch(slice.setLoading(state.loading));
    }
    if (state.error !== undefined) {
      store.dispatch(slice.setError(state.error));
    }
    if (state.success !== undefined) {
      store.dispatch(slice.setSuccess(state.success));
    }
    if (state.validationErrors) {
      store.dispatch(slice.setValidationErrors(state.validationErrors));
    }
    if (state.submitting !== undefined) {
      store.dispatch(slice.setSubmitting(state.submitting));
    }
  }

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
