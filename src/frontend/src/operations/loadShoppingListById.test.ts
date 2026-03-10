import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadShoppingListById } from './loadShoppingListById';
import type { ShoppingList } from '../types';

vi.mock('../api', () => ({
  fetchShoppingListById: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setShoppingListLoading: vi.fn(),
  setNotificationError: vi.fn(),
  addShoppingList: vi.fn(),
  setShoppingListsLoaded: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testList: ShoppingList = {
  id: 'list-1',
  title: 'Grocery Run',
  items: [{ id: 'item-1', label: 'Milk', checked: false, orderIndex: 0 }],
};

describe('loadShoppingListById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading and clears error before fetching', async () => {
    vi.mocked(api.fetchShoppingListById).mockResolvedValueOnce({ list: testList, message: 'OK' });

    await loadShoppingListById('list-1');

    expect(act.setShoppingListLoading).toHaveBeenCalledWith(true);
    expect(act.setNotificationError).toHaveBeenCalledWith(null);
  });

  it('adds shopping list on success', async () => {
    vi.mocked(api.fetchShoppingListById).mockResolvedValueOnce({ list: testList, message: 'OK' });

    await loadShoppingListById('list-1');

    expect(act.addShoppingList).toHaveBeenCalledWith(testList);
    expect(act.setShoppingListsLoaded).toHaveBeenCalledWith(true);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchShoppingListById).mockRejectedValueOnce(new Error('List not found'));

    await loadShoppingListById('list-1');

    expect(act.setNotificationError).toHaveBeenCalledWith('List not found');
    expect(act.addShoppingList).not.toHaveBeenCalled();
  });

  it('sets loading to false in finally block', async () => {
    vi.mocked(api.fetchShoppingListById).mockRejectedValueOnce(new Error('fail'));

    await loadShoppingListById('list-1');

    expect(act.setShoppingListLoading).toHaveBeenLastCalledWith(false);
  });
});
