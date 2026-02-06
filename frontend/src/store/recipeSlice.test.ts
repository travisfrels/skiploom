import { describe, it, expect } from 'vitest';
import recipeReducer, { clearCurrentRecipe } from './recipeSlice';
import type { Recipe } from '../types';

const mockRecipe: Recipe = {
  id: 'test-1',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: [{ id: 'i1', amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ id: 's1', orderIndex: 1, instruction: 'Mix well' }],
};

describe('recipeSlice', () => {
  describe('clearCurrentRecipe', () => {
    it('clears the current recipe', () => {
      const initialState = {
        recipeSummaries: [],
        recipesLoaded: false,
        currentRecipe: mockRecipe,
        loading: false,
        error: null,
      };
      const state = recipeReducer(initialState, clearCurrentRecipe());
      expect(state.currentRecipe).toBeNull();
    });
  });

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = recipeReducer(undefined, { type: 'unknown' });
      expect(state.recipeSummaries).toEqual([]);
      expect(state.recipesLoaded).toBe(false);
      expect(state.currentRecipe).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
