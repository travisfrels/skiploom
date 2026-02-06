import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Recipe, RecipeSummary } from '../types';
import {
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  type CreateRecipeRequest,
  type UpdateRecipeRequest,
} from '../api/recipeApi';

interface RecipeState {
  recipeSummaries: RecipeSummary[];
  recipesLoaded: boolean;
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipeSummaries: [],
  recipesLoaded: false,
  currentRecipe: null,
  loading: false,
  error: null,
};

export const loadRecipes = createAsyncThunk('recipes/loadRecipes', async () => {
  return await fetchRecipes();
});

export const loadRecipeById = createAsyncThunk(
  'recipes/loadRecipeById',
  async (id: string) => {
    return await fetchRecipeById(id);
  }
);

export const createNewRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (request: CreateRecipeRequest) => {
    return await createRecipe(request);
  }
);

export const updateExistingRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, request }: { id: string; request: UpdateRecipeRequest }) => {
    await updateRecipe(id, request);
    return id;
  }
);

export const deleteExistingRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id: string) => {
    await deleteRecipe(id);
    return id;
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    invalidateRecipes: (state) => {
      state.recipesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipeSummaries = action.payload;
        state.recipesLoaded = true;
      })
      .addCase(loadRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load recipes';
      })
      .addCase(loadRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(loadRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load recipe';
        state.currentRecipe = null;
      })
      .addCase(createNewRecipe.fulfilled, (state) => {
        state.recipesLoaded = false;
      })
      .addCase(updateExistingRecipe.fulfilled, (state) => {
        state.recipesLoaded = false;
        state.currentRecipe = null;
      })
      .addCase(deleteExistingRecipe.fulfilled, (state, action) => {
        state.recipesLoaded = false;
        state.recipeSummaries = state.recipeSummaries.filter(
          (r) => r.id !== action.payload
        );
        if (state.currentRecipe?.id === action.payload) {
          state.currentRecipe = null;
        }
      });
  },
});

export const { clearCurrentRecipe, invalidateRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;
