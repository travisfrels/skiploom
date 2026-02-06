import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadRecipeById } from './loadRecipeById';
import type { Recipe } from '../types';

vi.mock('../api', () => ({
  fetchRecipeById: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setCurrentRecipeId: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn(),
  addRecipe: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testRecipe: Recipe = {
  id: 'abc-123',
  title: 'Test Recipe',
  ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ orderIndex: 1, instruction: 'Mix' }],
};

describe('loadRecipeById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets current recipe id, loading, and clears error before fetching', async () => {
    vi.mocked(api.fetchRecipeById).mockResolvedValueOnce({ recipe: testRecipe, message: 'OK' });

    await loadRecipeById('abc-123');

    expect(act.setCurrentRecipeId).toHaveBeenCalledWith('abc-123');
    expect(act.setLoading).toHaveBeenCalledWith(true);
    expect(act.setError).toHaveBeenCalledWith(null);
  });

  it('adds recipe on success', async () => {
    vi.mocked(api.fetchRecipeById).mockResolvedValueOnce({ recipe: testRecipe, message: 'OK' });

    await loadRecipeById('abc-123');

    expect(act.addRecipe).toHaveBeenCalledWith(testRecipe);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchRecipeById).mockRejectedValueOnce(new Error('Recipe not found'));

    await loadRecipeById('abc-123');

    expect(act.setError).toHaveBeenCalledWith('Recipe not found');
    expect(act.addRecipe).not.toHaveBeenCalled();
  });

  it('sets loading to false in finally block', async () => {
    vi.mocked(api.fetchRecipeById).mockRejectedValueOnce(new Error('fail'));

    await loadRecipeById('abc-123');

    expect(act.setLoading).toHaveBeenLastCalledWith(false);
  });
});
