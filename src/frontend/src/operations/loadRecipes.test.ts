import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadRecipes } from './loadRecipes';
import type { Recipe } from '../types';

vi.mock('../api', () => ({
  fetchAllRecipes: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setLoading: vi.fn(),
  setError: vi.fn(),
  setRecipes: vi.fn(),
  setRecipesLoaded: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ orderIndex: 1, instruction: 'Mix' }],
};

describe('loadRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading and clears error before fetching', async () => {
    vi.mocked(api.fetchAllRecipes).mockResolvedValueOnce({ recipes: [], message: 'OK' });

    await loadRecipes();

    expect(act.setLoading).toHaveBeenCalledWith(true);
    expect(act.setError).toHaveBeenCalledWith(null);
  });

  it('sets recipes and marks loaded on success', async () => {
    vi.mocked(api.fetchAllRecipes).mockResolvedValueOnce({ recipes: [testRecipe], message: 'OK' });

    await loadRecipes();

    expect(act.setRecipes).toHaveBeenCalledWith([testRecipe]);
    expect(act.setRecipesLoaded).toHaveBeenCalledWith(true);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchAllRecipes).mockRejectedValueOnce(new Error('Network error'));

    await loadRecipes();

    expect(act.setError).toHaveBeenCalledWith('Network error');
    expect(act.setRecipes).not.toHaveBeenCalled();
  });

  it('sets loading to false in finally block', async () => {
    vi.mocked(api.fetchAllRecipes).mockRejectedValueOnce(new Error('fail'));

    await loadRecipes();

    expect(act.setLoading).toHaveBeenLastCalledWith(false);
  });
});
