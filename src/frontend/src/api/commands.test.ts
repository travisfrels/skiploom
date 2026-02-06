import { describe, it, expect, vi } from 'vitest';
import { createRecipe, updateRecipe, deleteRecipe } from './commands';
import type { Recipe } from '../types';

const testRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ orderIndex: 1, instruction: 'Mix ingredients' }],
};

describe('commands', () => {
  describe('createRecipe', () => {
    it('sends POST to create_recipe with command body', async () => {
      const responseData = { recipe: testRecipe, message: 'Created' };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responseData),
      } as Response);

      const result = await createRecipe({ recipe: testRecipe });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/commands/create_recipe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipe: testRecipe }),
        }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('updateRecipe', () => {
    it('sends POST to update_recipe with command body', async () => {
      const responseData = { recipe: testRecipe, message: 'Updated' };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responseData),
      } as Response);

      const result = await updateRecipe({ recipe: testRecipe });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/commands/update_recipe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipe: testRecipe }),
        }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('deleteRecipe', () => {
    it('sends POST to delete_recipe with command body', async () => {
      const responseData = { message: 'Deleted' };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(responseData),
      } as Response);

      const result = await deleteRecipe({ id: '1' });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/commands/delete_recipe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: '1' }),
        }
      );
      expect(result).toEqual(responseData);
    });
  });
});
