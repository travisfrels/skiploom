import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createShoppingList } from './createShoppingList';
import { ValidationFailedError } from '../types';
import type { ShoppingList } from '../types';

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  createShoppingList: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  clearShoppingListValidationErrors: vi.fn(),
  setShoppingListError: vi.fn(),
  setShoppingListSuccess: vi.fn(),
  setShoppingListSubmitting: vi.fn(),
  addShoppingList: vi.fn(),
  setShoppingListValidationErrors: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testList: ShoppingList = {
  id: 'list-1',
  title: 'Grocery Run',
  items: [{ id: 'item-1', label: 'Milk', checked: false, orderIndex: 0 }],
};

describe('createShoppingList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears validation errors and error state before submitting', async () => {
    vi.mocked(api.createShoppingList).mockResolvedValueOnce({ list: testList, message: 'Created' });

    await createShoppingList(testList);

    expect(act.clearShoppingListValidationErrors).toHaveBeenCalled();
    expect(act.setShoppingListError).toHaveBeenCalledWith(null);
    expect(act.setShoppingListSuccess).toHaveBeenCalledWith(null);
    expect(act.setShoppingListSubmitting).toHaveBeenCalledWith(true);
  });

  it('adds shopping list and returns id on success', async () => {
    vi.mocked(api.createShoppingList).mockResolvedValueOnce({ list: testList, message: 'Created' });

    const result = await createShoppingList(testList);

    expect(act.addShoppingList).toHaveBeenCalledWith(testList);
    expect(act.setShoppingListSuccess).toHaveBeenCalledWith('Shopping list created successfully');
    expect(result).toBe('list-1');
  });

  it('sets validation errors and returns null on validation failure', async () => {
    const errors = [{ field: 'title', message: 'Title is required' }];
    vi.mocked(api.createShoppingList).mockRejectedValueOnce(
      new ValidationFailedError({
        type: 'about:blank', title: 'Bad Request', status: 400,
        detail: 'Validation failed', instance: '/api/commands/create_shopping_list',
        errors,
      })
    );

    const result = await createShoppingList(testList);

    expect(act.setShoppingListValidationErrors).toHaveBeenCalledWith(errors);
    expect(act.setShoppingListError).not.toHaveBeenCalledWith(expect.any(String));
    expect(result).toBeNull();
  });

  it('sets error and returns null on non-validation failure', async () => {
    vi.mocked(api.createShoppingList).mockRejectedValueOnce(new Error('Server error'));

    const result = await createShoppingList(testList);

    expect(act.setShoppingListError).toHaveBeenCalledWith('Server error');
    expect(act.setShoppingListValidationErrors).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('does not set success message on failure', async () => {
    vi.mocked(api.createShoppingList).mockRejectedValueOnce(new Error('Server error'));

    await createShoppingList(testList);

    expect(act.setShoppingListSuccess).not.toHaveBeenCalledWith('Shopping list created successfully');
  });

  it('sets submitting to false in finally block', async () => {
    vi.mocked(api.createShoppingList).mockRejectedValueOnce(new Error('fail'));

    await createShoppingList(testList);

    expect(act.setShoppingListSubmitting).toHaveBeenLastCalledWith(false);
  });
});
