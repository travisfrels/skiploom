import * as api from '../api';
import * as act from '../store/actions';

export async function loadShoppingListById(id: string): Promise<void> {
  act.setShoppingListLoading(true);
  act.setNotificationError(null);

  try {
    const response = await api.fetchShoppingListById({ id });
    act.addShoppingList(response.list);
    act.setShoppingListsLoaded(true);
  } catch (err) {
    act.setNotificationError(err instanceof Error ? err.message : 'Failed to load shopping list');
  } finally {
    act.setShoppingListLoading(false);
  }
}
