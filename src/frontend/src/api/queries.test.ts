import { describe, it, expect, vi } from 'vitest';
import { fetchAllRecipes, fetchRecipeById } from './queries';
import type { Recipe } from '../types';

const testRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ orderIndex: 1, instruction: 'Mix ingredients' }],
};

describe('queries', () => {
  describe('fetchAllRecipes', () => {
    it('sends GET to fetch_all_recipes', async () => {
      const responseData = { recipes: [testRecipe], message: 'OK' };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responseData),
      } as Response);

      const result = await fetchAllRecipes();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/queries/fetch_all_recipes'
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('fetchRecipeById', () => {
    it('sends GET to fetch_recipe_by_id with id in URL', async () => {
      const responseData = { recipe: testRecipe, message: 'OK' };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responseData),
      } as Response);

      const result = await fetchRecipeById({ id: 'abc-123' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/queries/fetch_recipe_by_id/abc-123'
      );
      expect(result).toEqual(responseData);
    });
  });
});
