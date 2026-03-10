import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadShoppingLists } from './loadShoppingLists';
import type { ShoppingList } from '../types';

vi.mock('../api', () => ({
  fetchShoppingLists: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setShoppingListLoading: vi.fn(),
  setShoppingListError: vi.fn(),
  setShoppingLists: vi.fn(),
  setShoppingListsLoaded: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testList: ShoppingList = {
  id: 'list-1',
  title: 'Grocery Run',
  items: [],
};

describe('loadShoppingLists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading and clears error before fetching', async () => {
    vi.mocked(api.fetchShoppingLists).mockResolvedValueOnce({ lists: [], message: 'OK' });

    await loadShoppingLists();

    expect(act.setShoppingListLoading).toHaveBeenCalledWith(true);
    expect(act.setShoppingListError).toHaveBeenCalledWith(null);
  });

  it('sets shopping lists and marks loaded on success', async () => {
    vi.mocked(api.fetchShoppingLists).mockResolvedValueOnce({ lists: [testList], message: 'OK' });

    await loadShoppingLists();

    expect(act.setShoppingLists).toHaveBeenCalledWith([testList]);
    expect(act.setShoppingListsLoaded).toHaveBeenCalledWith(true);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchShoppingLists).mockRejectedValueOnce(new Error('Network error'));

    await loadShoppingLists();

    expect(act.setShoppingListError).toHaveBeenCalledWith('Network error');
    expect(act.setShoppingLists).not.toHaveBeenCalled();
  });

  it('sets loading to false in finally block', async () => {
    vi.mocked(api.fetchShoppingLists).mockRejectedValueOnce(new Error('fail'));

    await loadShoppingLists();

    expect(act.setShoppingListLoading).toHaveBeenLastCalledWith(false);
  });
});
