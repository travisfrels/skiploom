import * as api from '../api/recipeApi';
import * as act from '../store/actions';

export async function loadRecipeById(id: string): Promise<void> {
  act.setCurrentRecipeId(id);
  act.setLoading(true);
  act.setError(null);

  try {
    const response = await api.fetchRecipeById({ id });
    act.addRecipe(response.recipe);
  } catch (err) {
    act.setError(err instanceof Error ? err.message : 'Failed to load recipe');
  } finally {
    act.setLoading(false);
  }
}
