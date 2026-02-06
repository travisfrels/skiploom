import * as api from '../api';
import * as act from '../store/actions';

export async function loadRecipes(): Promise<void> {
  act.setLoading(true);
  act.setError(null);

  try {
    const response = await api.fetchAllRecipes();
    act.setRecipes(response.recipes);
    act.setRecipesLoaded(true);
  } catch (err) {
    act.setError(err instanceof Error ? err.message : 'Failed to load recipes');
  } finally {
    act.setLoading(false);
  }
}
