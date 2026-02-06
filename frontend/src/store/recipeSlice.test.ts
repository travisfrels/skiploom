import { describe, it, expect } from 'vitest';
import recipeReducer, { clearCurrentRecipeId, setRecipes, addRecipe, setSuccess } from './recipeSlice';
import type { Recipe } from '../types';

const mockRecipe: Recipe = {
  id: 'test-1',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ orderIndex: 1, instruction: 'Mix well' }],
};

describe('recipeSlice', () => {
  describe('clearCurrentRecipeId', () => {
    it('clears the current recipe id', () => {
      const initialState = {
        recipes: { 'test-1': mockRecipe },
        recipesLoaded: false,
        currentRecipeId: 'test-1',
        loading: false,
        error: null,
        success: null,
        validationErrors: [],
        submitting: false,
      };
      const state = recipeReducer(initialState, clearCurrentRecipeId());
      expect(state.currentRecipeId).toBeNull();
    });
  });

  describe('setRecipes', () => {
    it('converts array to map indexed by id', () => {
      const initialState = {
        recipes: {},
        recipesLoaded: false,
        currentRecipeId: null,
        loading: false,
        error: null,
        success: null,
        validationErrors: [],
        submitting: false,
      };
      const state = recipeReducer(initialState, setRecipes([mockRecipe]));
      expect(state.recipes['test-1']).toEqual(mockRecipe);
    });
  });

  describe('addRecipe', () => {
    it('adds recipe to map', () => {
      const initialState = {
        recipes: {},
        recipesLoaded: false,
        currentRecipeId: null,
        loading: false,
        error: null,
        success: null,
        validationErrors: [],
        submitting: false,
      };
      const state = recipeReducer(initialState, addRecipe(mockRecipe));
      expect(state.recipes['test-1']).toEqual(mockRecipe);
    });
  });

  describe('setSuccess', () => {
    it('sets the success message', () => {
      const initialState = {
        recipes: {},
        recipesLoaded: false,
        currentRecipeId: null,
        loading: false,
        error: null,
        success: null,
        validationErrors: [],
        submitting: false,
      };
      const state = recipeReducer(initialState, setSuccess('Recipe created successfully'));
      expect(state.success).toBe('Recipe created successfully');
    });

    it('clears the success message', () => {
      const initialState = {
        recipes: {},
        recipesLoaded: false,
        currentRecipeId: null,
        loading: false,
        error: null,
        success: 'Recipe created successfully',
        validationErrors: [],
        submitting: false,
      };
      const state = recipeReducer(initialState, setSuccess(null));
      expect(state.success).toBeNull();
    });
  });

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = recipeReducer(undefined, { type: 'unknown' });
      expect(state.recipes).toEqual({});
      expect(state.recipesLoaded).toBe(false);
      expect(state.currentRecipeId).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.success).toBeNull();
      expect(state.validationErrors).toEqual([]);
      expect(state.submitting).toBe(false);
    });
  });
});
