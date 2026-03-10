import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteShoppingList } from './deleteShoppingList';

vi.mock('../api', () => ({
  deleteShoppingList: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setShoppingListError: vi.fn(),
  setShoppingListSuccess: vi.fn(),
  setShoppingListSubmitting: vi.fn(),
  removeShoppingList: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

describe('deleteShoppingList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears error state before submitting', async () => {
    vi.mocked(api.deleteShoppingList).mockResolvedValueOnce({ message: 'Deleted' });

    await deleteShoppingList({ id: 'list-1' });

    expect(act.setShoppingListError).toHaveBeenCalledWith(null);
    expect(act.setShoppingListSuccess).toHaveBeenCalledWith(null);
    expect(act.setShoppingListSubmitting).toHaveBeenCalledWith(true);
  });

  it('removes shopping list and returns true on success', async () => {
    vi.mocked(api.deleteShoppingList).mockResolvedValueOnce({ message: 'Deleted' });

    const result = await deleteShoppingList({ id: 'list-1' });

    expect(act.removeShoppingList).toHaveBeenCalledWith('list-1');
    expect(act.setShoppingListSuccess).toHaveBeenCalledWith('Shopping list deleted successfully');
    expect(result).toBe(true);
  });

  it('sets error and returns false on failure', async () => {
    vi.mocked(api.deleteShoppingList).mockRejectedValueOnce(new Error('List not found'));

    const result = await deleteShoppingList({ id: 'list-1' });

    expect(act.setShoppingListError).toHaveBeenCalledWith('List not found');
    expect(result).toBe(false);
  });

  it('does not set success message on failure', async () => {
    vi.mocked(api.deleteShoppingList).mockRejectedValueOnce(new Error('List not found'));

    await deleteShoppingList({ id: 'list-1' });

    expect(act.setShoppingListSuccess).not.toHaveBeenCalledWith('Shopping list deleted successfully');
  });

  it('sets submitting to false in finally block', async () => {
    vi.mocked(api.deleteShoppingList).mockRejectedValueOnce(new Error('fail'));

    await deleteShoppingList({ id: 'list-1' });

    expect(act.setShoppingListSubmitting).toHaveBeenLastCalledWith(false);
  });
});
