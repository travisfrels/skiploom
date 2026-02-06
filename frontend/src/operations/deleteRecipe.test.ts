import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteRecipe } from './deleteRecipe';

vi.mock('../api', () => ({
  deleteRecipe: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setError: vi.fn(),
  setSuccess: vi.fn(),
  setSubmitting: vi.fn(),
  removeRecipe: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

describe('deleteRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears error state before submitting', async () => {
    vi.mocked(api.deleteRecipe).mockResolvedValueOnce({ message: 'Deleted' });

    await deleteRecipe('1');

    expect(act.setError).toHaveBeenCalledWith(null);
    expect(act.setSuccess).toHaveBeenCalledWith(null);
    expect(act.setSubmitting).toHaveBeenCalledWith(true);
  });

  it('removes recipe and returns true on success', async () => {
    vi.mocked(api.deleteRecipe).mockResolvedValueOnce({ message: 'Deleted' });

    const result = await deleteRecipe('1');

    expect(act.removeRecipe).toHaveBeenCalledWith('1');
    expect(act.setSuccess).toHaveBeenCalledWith('Recipe deleted successfully');
    expect(result).toBe(true);
  });

  it('sets error and returns false on failure', async () => {
    vi.mocked(api.deleteRecipe).mockRejectedValueOnce(new Error('Recipe not found'));

    const result = await deleteRecipe('1');

    expect(act.setError).toHaveBeenCalledWith('Recipe not found');
    expect(result).toBe(false);
  });

  it('does not set success message on failure', async () => {
    vi.mocked(api.deleteRecipe).mockRejectedValueOnce(new Error('Recipe not found'));

    await deleteRecipe('1');

    expect(act.setSuccess).not.toHaveBeenCalledWith('Recipe deleted successfully');
  });

  it('sets submitting to false in finally block', async () => {
    vi.mocked(api.deleteRecipe).mockRejectedValueOnce(new Error('fail'));

    await deleteRecipe('1');

    expect(act.setSubmitting).toHaveBeenLastCalledWith(false);
  });
});
