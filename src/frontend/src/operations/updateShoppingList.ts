import type { UpdateShoppingListCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function updateShoppingList(command: UpdateShoppingListCommand): Promise<boolean> {
  act.clearShoppingListValidationErrors();
  act.setShoppingListError(null);
  act.setShoppingListSuccess(null);
  act.setShoppingListSubmitting(true);

  try {
    const response = await api.updateShoppingList(command);
    act.updateShoppingList(response.list);
    act.setShoppingListSuccess('Shopping list updated successfully');
    return true;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setShoppingListValidationErrors(err.errors);
    } else {
      act.setShoppingListError(err instanceof Error ? err.message : 'Failed to update shopping list');
    }
    return false;
  } finally {
    act.setShoppingListSubmitting(false);
  }
}
