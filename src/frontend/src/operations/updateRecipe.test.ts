import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateRecipe } from './updateRecipe';
import { ValidationFailedError } from '../types';
import type { Recipe } from '../types';

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  updateRecipe: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  clearValidationErrors: vi.fn(),
  setError: vi.fn(),
  setSuccess: vi.fn(),
  setSubmitting: vi.fn(),
  updateRecipe: vi.fn(),
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

describe('updateRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears validation errors and error state before submitting', async () => {
    vi.mocked(api.updateRecipe).mockResolvedValueOnce({ recipe: testRecipe, message: 'Updated' });

    await updateRecipe(testRecipe);

    expect(act.clearValidationErrors).toHaveBeenCalled();
    expect(act.setError).toHaveBeenCalledWith(null);
    expect(act.setSuccess).toHaveBeenCalledWith(null);
    expect(act.setSubmitting).toHaveBeenCalledWith(true);
  });

  it('updates recipe and returns true on success', async () => {
    vi.mocked(api.updateRecipe).mockResolvedValueOnce({ recipe: testRecipe, message: 'Updated' });

    const result = await updateRecipe(testRecipe);

    expect(act.updateRecipe).toHaveBeenCalledWith(testRecipe);
    expect(act.setSuccess).toHaveBeenCalledWith('Recipe updated successfully');
    expect(result).toBe(true);
  });

  it('sets validation errors and returns false on validation failure', async () => {
    const errors = [{ field: 'title', message: 'Title is required' }];
    vi.mocked(api.updateRecipe).mockRejectedValueOnce(
      new ValidationFailedError({
        type: 'about:blank', title: 'Bad Request', status: 400,
        detail: 'Validation failed', instance: '/api/commands/update_recipe',
        errors,
      })
    );

    const result = await updateRecipe(testRecipe);

    expect(act.setValidationErrors).toHaveBeenCalledWith(errors);
    expect(result).toBe(false);
  });

  it('sets error and returns false on non-validation failure', async () => {
    vi.mocked(api.updateRecipe).mockRejectedValueOnce(new Error('Recipe not found'));

    const result = await updateRecipe(testRecipe);

    expect(act.setError).toHaveBeenCalledWith('Recipe not found');
    expect(act.setValidationErrors).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('does not set success message on failure', async () => {
    vi.mocked(api.updateRecipe).mockRejectedValueOnce(new Error('Recipe not found'));

    await updateRecipe(testRecipe);

    expect(act.setSuccess).not.toHaveBeenCalledWith('Recipe updated successfully');
  });

  it('sets submitting to false in finally block', async () => {
    vi.mocked(api.updateRecipe).mockRejectedValueOnce(new Error('fail'));

    await updateRecipe(testRecipe);

    expect(act.setSubmitting).toHaveBeenLastCalledWith(false);
  });
});
