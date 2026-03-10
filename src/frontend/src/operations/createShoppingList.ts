import type { CreateShoppingListCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function createShoppingList(command: CreateShoppingListCommand): Promise<string | null> {
  act.clearShoppingListValidationErrors();
  act.setNotificationError(null);
  act.setNotificationSuccess(null);
  act.setShoppingListSubmitting(true);

  try {
    const response = await api.createShoppingList(command);
    act.addShoppingList(response.list);
    act.setNotificationSuccess('Shopping list created successfully');
    return response.list.id;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setShoppingListValidationErrors(err.errors);
    } else {
      act.setNotificationError(err instanceof Error ? err.message : 'Failed to create shopping list');
    }
    return null;
  } finally {
    act.setShoppingListSubmitting(false);
  }
}
