import type { DeleteShoppingListCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function deleteShoppingList(command: DeleteShoppingListCommand): Promise<boolean> {
  act.setNotificationError(null);
  act.setNotificationSuccess(null);
  act.setShoppingListSubmitting(true);

  try {
    await api.deleteShoppingList(command);
    act.removeShoppingList(command.id);
    act.setNotificationSuccess('Shopping list deleted successfully');
    return true;
  } catch (err) {
    act.setNotificationError(err instanceof Error ? err.message : 'Failed to delete shopping list');
    return false;
  } finally {
    act.setShoppingListSubmitting(false);
  }
}
