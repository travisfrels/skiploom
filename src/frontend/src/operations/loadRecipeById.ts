import * as api from '../api';
import * as act from '../store/actions';

export async function loadRecipeById(id: string): Promise<void> {
  act.setCurrentRecipeId(id);
  act.setLoading(true);
  act.setNotificationError(null);

  try {
    const response = await api.fetchRecipeById({ id });
    act.addRecipe(response.recipe);
  } catch (err) {
    act.setNotificationError(err instanceof Error ? err.message : 'Failed to load recipe');
  } finally {
    act.setLoading(false);
  }
}
