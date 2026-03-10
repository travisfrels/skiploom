import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../store';
import * as featureFlagSlice from '../store/featureFlagSlice';
import * as slice from '../store/recipeSlice';
import * as mealPlanSlice from '../store/mealPlanSlice';
import * as notificationSlice from '../store/notificationSlice';
import * as shoppingListSlice from '../store/shoppingListSlice';
import * as userSlice from '../store/userSlice';
import type { MealPlanEntry, Recipe, ShoppingList, User, ValidationError } from '../types';

interface RecipeState {
  recipes: Record<string, Recipe>;
  recipesLoaded: boolean;
  currentRecipeId: string | null;
  loading: boolean;
  validationErrors: ValidationError[];
  submitting: boolean;
}

interface UserState {
  user: User | null;
}

interface FeatureFlagState {
  featureFlags: Record<string, boolean>;
  featureFlagsLoaded: boolean;
  loading: boolean;
  error: string | null;
}

interface NotificationState {
  error: string | null;
  success: string | null;
}

interface MealPlanState {
  entries: Record<string, MealPlanEntry>;
  entriesLoaded: boolean;
  loading: boolean;
  validationErrors: ValidationError[];
  submitting: boolean;
}

interface ShoppingListState {
  lists: Record<string, ShoppingList>;
  listsLoaded: boolean;
  currentListId: string | null;
  loading: boolean;
  validationErrors: ValidationError[];
  submitting: boolean;
}

interface RenderOptions {
  preloadedState?: {
    featureFlags?: Partial<FeatureFlagState>;
    mealPlan?: Partial<MealPlanState>;
    notification?: Partial<NotificationState>;
    recipes?: Partial<RecipeState>;
    shoppingList?: Partial<ShoppingListState>;
    user?: Partial<UserState>;
  };
  initialEntries?: string[];
}

function resetStore() {
  store.dispatch(featureFlagSlice.setFeatureFlags({}));
  store.dispatch(featureFlagSlice.setFeatureFlagsLoaded(false));
  store.dispatch(featureFlagSlice.setFeatureFlagLoading(false));
  store.dispatch(featureFlagSlice.setFeatureFlagError(null));
  store.dispatch(notificationSlice.clearNotifications());
  store.dispatch(slice.setRecipes([]));
  store.dispatch(slice.setRecipesLoaded(false));
  store.dispatch(slice.setCurrentRecipeId(null));
  store.dispatch(slice.setLoading(false));
  store.dispatch(slice.setValidationErrors([]));
  store.dispatch(slice.setSubmitting(false));
  store.dispatch(mealPlanSlice.setEntries([]));
  store.dispatch(mealPlanSlice.setEntriesLoaded(false));
  store.dispatch(mealPlanSlice.setLoading(false));
  store.dispatch(mealPlanSlice.setValidationErrors([]));
  store.dispatch(mealPlanSlice.setSubmitting(false));
  store.dispatch(shoppingListSlice.setLists([]));
  store.dispatch(shoppingListSlice.setListsLoaded(false));
  store.dispatch(shoppingListSlice.setCurrentListId(null));
  store.dispatch(shoppingListSlice.setLoading(false));
  store.dispatch(shoppingListSlice.setValidationErrors([]));
  store.dispatch(shoppingListSlice.setSubmitting(false));
  store.dispatch(userSlice.setUser(null));
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

  if (preloadedState?.featureFlags) {
    const state = preloadedState.featureFlags;
    if (state.featureFlags !== undefined) {
      store.dispatch(featureFlagSlice.setFeatureFlags(state.featureFlags));
    }
    if (state.featureFlagsLoaded !== undefined) {
      store.dispatch(featureFlagSlice.setFeatureFlagsLoaded(state.featureFlagsLoaded));
    }
    if (state.loading !== undefined) {
      store.dispatch(featureFlagSlice.setFeatureFlagLoading(state.loading));
    }
    if (state.error !== undefined) {
      store.dispatch(featureFlagSlice.setFeatureFlagError(state.error));
    }
  }

  if (preloadedState?.notification) {
    const state = preloadedState.notification;
    if (state.error !== undefined) {
      store.dispatch(notificationSlice.setError(state.error));
    }
    if (state.success !== undefined) {
      store.dispatch(notificationSlice.setSuccess(state.success));
    }
  }

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
    if (state.validationErrors) {
      store.dispatch(slice.setValidationErrors(state.validationErrors));
    }
    if (state.submitting !== undefined) {
      store.dispatch(slice.setSubmitting(state.submitting));
    }
  }

  if (preloadedState?.mealPlan) {
    const state = preloadedState.mealPlan;
    if (state.entries) {
      const entriesArray = Object.values(state.entries);
      store.dispatch(mealPlanSlice.setEntries(entriesArray));
    }
    if (state.entriesLoaded !== undefined) {
      store.dispatch(mealPlanSlice.setEntriesLoaded(state.entriesLoaded));
    }
    if (state.loading !== undefined) {
      store.dispatch(mealPlanSlice.setLoading(state.loading));
    }
    if (state.validationErrors) {
      store.dispatch(mealPlanSlice.setValidationErrors(state.validationErrors));
    }
    if (state.submitting !== undefined) {
      store.dispatch(mealPlanSlice.setSubmitting(state.submitting));
    }
  }

  if (preloadedState?.shoppingList) {
    const state = preloadedState.shoppingList;
    if (state.lists) {
      const listsArray = Object.values(state.lists);
      store.dispatch(shoppingListSlice.setLists(listsArray));
    }
    if (state.listsLoaded !== undefined) {
      store.dispatch(shoppingListSlice.setListsLoaded(state.listsLoaded));
    }
    if (state.currentListId !== undefined) {
      store.dispatch(shoppingListSlice.setCurrentListId(state.currentListId));
    }
    if (state.loading !== undefined) {
      store.dispatch(shoppingListSlice.setLoading(state.loading));
    }
    if (state.validationErrors) {
      store.dispatch(shoppingListSlice.setValidationErrors(state.validationErrors));
    }
    if (state.submitting !== undefined) {
      store.dispatch(shoppingListSlice.setSubmitting(state.submitting));
    }
  }

  if (preloadedState?.user) {
    const state = preloadedState.user;
    if (state.user !== undefined) {
      store.dispatch(userSlice.setUser(state.user));
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
