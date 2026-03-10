import * as api from '../api';
import * as act from '../store/actions';

export async function loadShoppingLists(): Promise<void> {
  act.setShoppingListLoading(true);
  act.setShoppingListError(null);

  try {
    const response = await api.fetchShoppingLists();
    act.setShoppingLists(response.lists);
    act.setShoppingListsLoaded(true);
  } catch (err) {
    act.setShoppingListError(err instanceof Error ? err.message : 'Failed to load shopping lists');
  } finally {
    act.setShoppingListLoading(false);
  }
}
