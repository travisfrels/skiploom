import type { CreateShoppingListCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function createShoppingList(command: CreateShoppingListCommand): Promise<string | null> {
  act.clearShoppingListValidationErrors();
  act.setShoppingListError(null);
  act.setShoppingListSuccess(null);
  act.setShoppingListSubmitting(true);

  try {
    const response = await api.createShoppingList(command);
    act.addShoppingList(response.list);
    act.setShoppingListSuccess('Shopping list created successfully');
    return response.list.id;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setShoppingListValidationErrors(err.errors);
    } else {
      act.setShoppingListError(err instanceof Error ? err.message : 'Failed to create shopping list');
    }
    return null;
  } finally {
    act.setShoppingListSubmitting(false);
  }
}
