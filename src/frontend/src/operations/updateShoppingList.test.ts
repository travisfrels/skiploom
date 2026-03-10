import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateShoppingList } from './updateShoppingList';
import { ValidationFailedError } from '../types';
import type { ShoppingList } from '../types';

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  updateShoppingList: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  clearShoppingListValidationErrors: vi.fn(),
  setNotificationError: vi.fn(),
  setNotificationSuccess: vi.fn(),
  setShoppingListSubmitting: vi.fn(),
  updateShoppingList: vi.fn(),
  setShoppingListValidationErrors: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testList: ShoppingList = {
  id: 'list-1',
  title: 'Grocery Run',
  items: [{ id: 'item-1', label: 'Milk', checked: false, orderIndex: 0 }],
};

describe('updateShoppingList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears validation errors and error state before submitting', async () => {
    vi.mocked(api.updateShoppingList).mockResolvedValueOnce({ list: testList, message: 'Updated' });

    await updateShoppingList(testList);

    expect(act.clearShoppingListValidationErrors).toHaveBeenCalled();
    expect(act.setNotificationError).toHaveBeenCalledWith(null);
    expect(act.setNotificationSuccess).toHaveBeenCalledWith(null);
    expect(act.setShoppingListSubmitting).toHaveBeenCalledWith(true);
  });

  it('updates shopping list and returns true on success', async () => {
    vi.mocked(api.updateShoppingList).mockResolvedValueOnce({ list: testList, message: 'Updated' });

    const result = await updateShoppingList(testList);

    expect(act.updateShoppingList).toHaveBeenCalledWith(testList);
    expect(act.setNotificationSuccess).toHaveBeenCalledWith('Shopping list updated successfully');
    expect(result).toBe(true);
  });

  it('sets validation errors and returns false on validation failure', async () => {
    const errors = [{ field: 'title', message: 'Title is required' }];
    vi.mocked(api.updateShoppingList).mockRejectedValueOnce(
      new ValidationFailedError({
        type: 'about:blank', title: 'Bad Request', status: 400,
        detail: 'Validation failed', instance: '/api/commands/update_shopping_list',
        errors,
      })
    );

    const result = await updateShoppingList(testList);

    expect(act.setShoppingListValidationErrors).toHaveBeenCalledWith(errors);
    expect(result).toBe(false);
  });

  it('sets error and returns false on non-validation failure', async () => {
    vi.mocked(api.updateShoppingList).mockRejectedValueOnce(new Error('List not found'));

    const result = await updateShoppingList(testList);

    expect(act.setNotificationError).toHaveBeenCalledWith('List not found');
    expect(act.setShoppingListValidationErrors).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('does not set success message on failure', async () => {
    vi.mocked(api.updateShoppingList).mockRejectedValueOnce(new Error('List not found'));

    await updateShoppingList(testList);

    expect(act.setNotificationSuccess).not.toHaveBeenCalledWith('Shopping list updated successfully');
  });

  it('sets submitting to false in finally block', async () => {
    vi.mocked(api.updateShoppingList).mockRejectedValueOnce(new Error('fail'));

    await updateShoppingList(testList);

    expect(act.setShoppingListSubmitting).toHaveBeenLastCalledWith(false);
  });
});
