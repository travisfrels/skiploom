import { describe, it, expect } from 'vitest';
import recipeReducer, { addRecipe, updateRecipe, deleteRecipe } from './recipeSlice';
import type { Recipe } from '../types';

const mockRecipe: Recipe = {
  id: 'test-1',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: [{ id: 'i1', amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ id: 's1', orderIndex: 1, instruction: 'Mix well' }],
};

describe('recipeSlice', () => {
  describe('addRecipe', () => {
    it('adds a recipe to the state', () => {
      const initialState = { recipes: [] };
      const state = recipeReducer(initialState, addRecipe(mockRecipe));
      expect(state.recipes).toHaveLength(1);
      expect(state.recipes[0]).toEqual(mockRecipe);
    });
  });

  describe('updateRecipe', () => {
    it('updates an existing recipe', () => {
      const initialState = { recipes: [mockRecipe] };
      const updatedRecipe = { ...mockRecipe, title: 'Updated Title' };
      const state = recipeReducer(initialState, updateRecipe(updatedRecipe));
      expect(state.recipes[0].title).toBe('Updated Title');
    });

    it('does nothing if recipe not found', () => {
      const initialState = { recipes: [mockRecipe] };
      const nonExistentRecipe = { ...mockRecipe, id: 'non-existent' };
      const state = recipeReducer(initialState, updateRecipe(nonExistentRecipe));
      expect(state.recipes).toHaveLength(1);
      expect(state.recipes[0].id).toBe('test-1');
    });
  });

  describe('deleteRecipe', () => {
    it('removes a recipe from the state', () => {
      const initialState = { recipes: [mockRecipe] };
      const state = recipeReducer(initialState, deleteRecipe('test-1'));
      expect(state.recipes).toHaveLength(0);
    });

    it('does nothing if recipe not found', () => {
      const initialState = { recipes: [mockRecipe] };
      const state = recipeReducer(initialState, deleteRecipe('non-existent'));
      expect(state.recipes).toHaveLength(1);
    });
  });
});
