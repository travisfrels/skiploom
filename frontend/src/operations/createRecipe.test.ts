import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRecipe } from './createRecipe';
import { ValidationFailedError } from '../types';
import type { Recipe } from '../types';

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  createRecipe: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  clearValidationErrors: vi.fn(),
  setError: vi.fn(),
  setSuccess: vi.fn(),
  setSubmitting: vi.fn(),
  addRecipe: vi.fn(),
  setValidationErrors: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
  steps: [{ orderIndex: 1, instruction: 'Mix' }],
};

describe('createRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears validation errors and error state before submitting', async () => {
    vi.mocked(api.createRecipe).mockResolvedValueOnce({ recipe: testRecipe, message: 'Created' });

    await createRecipe({ recipe: testRecipe });

    expect(act.clearValidationErrors).toHaveBeenCalled();
    expect(act.setError).toHaveBeenCalledWith(null);
    expect(act.setSuccess).toHaveBeenCalledWith(null);
    expect(act.setSubmitting).toHaveBeenCalledWith(true);
  });

  it('adds recipe and returns id on success', async () => {
    vi.mocked(api.createRecipe).mockResolvedValueOnce({ recipe: testRecipe, message: 'Created' });

    const result = await createRecipe({ recipe: testRecipe });

    expect(act.addRecipe).toHaveBeenCalledWith(testRecipe);
    expect(act.setSuccess).toHaveBeenCalledWith('Recipe created successfully');
    expect(result).toBe('1');
  });

  it('sets validation errors and returns null on validation failure', async () => {
    const errors = [{ field: 'title', message: 'Title is required' }];
    vi.mocked(api.createRecipe).mockRejectedValueOnce(
      new ValidationFailedError({
        type: 'about:blank', title: 'Bad Request', status: 400,
        detail: 'Validation failed', instance: '/api/commands/create_recipe',
        errors,
      })
    );

    const result = await createRecipe({ recipe: testRecipe });

    expect(act.setValidationErrors).toHaveBeenCalledWith(errors);
    expect(act.setError).not.toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeNull();
  });

  it('sets error and returns null on non-validation failure', async () => {
    vi.mocked(api.createRecipe).mockRejectedValueOnce(new Error('Server error'));

    const result = await createRecipe({ recipe: testRecipe });

    expect(act.setError).toHaveBeenCalledWith('Server error');
    expect(act.setValidationErrors).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('does not set success message on failure', async () => {
    vi.mocked(api.createRecipe).mockRejectedValueOnce(new Error('Server error'));

    await createRecipe({ recipe: testRecipe });

    expect(act.setSuccess).not.toHaveBeenCalledWith('Recipe created successfully');
  });

  it('sets submitting to false in finally block', async () => {
    vi.mocked(api.createRecipe).mockRejectedValueOnce(new Error('fail'));

    await createRecipe({ recipe: testRecipe });

    expect(act.setSubmitting).toHaveBeenLastCalledWith(false);
  });
});
