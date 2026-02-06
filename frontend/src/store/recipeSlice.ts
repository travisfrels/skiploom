import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Recipe, ValidationError } from '../types';

interface RecipeState {
  recipes: Record<string, Recipe>;
  recipesLoaded: boolean;
  currentRecipeId: string | null;
  loading: boolean;
  error: string | null;
  validationErrors: ValidationError[];
  submitting: boolean;
}

const initialState: RecipeState = {
  recipes: {},
  recipesLoaded: false,
  currentRecipeId: null,
  loading: false,
  error: null,
  validationErrors: [],
  submitting: false,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = {};
      for (const recipe of action.payload) {
        state.recipes[recipe.id] = recipe;
      }
    },
    setRecipesLoaded: (state, action: PayloadAction<boolean>) => {
      state.recipesLoaded = action.payload;
    },
    setCurrentRecipeId: (state, action: PayloadAction<string | null>) => {
      state.currentRecipeId = action.payload;
    },
    clearCurrentRecipeId: (state) => {
      state.currentRecipeId = null;
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes[action.payload.id] = action.payload;
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes[action.payload.id] = action.payload;
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      delete state.recipes[action.payload];
      if (state.currentRecipeId === action.payload) {
        state.currentRecipeId = null;
      }
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setRecipes,
  setRecipesLoaded,
  setCurrentRecipeId,
  clearCurrentRecipeId,
  addRecipe,
  updateRecipe,
  removeRecipe,
  setSubmitting,
  setValidationErrors,
  clearValidationErrors,
} = recipeSlice.actions;
export default recipeSlice.reducer;
