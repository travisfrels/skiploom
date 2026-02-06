import * as api from '../api/recipeApi';
import * as act from '../store/actions';

export async function deleteRecipe(id: string): Promise<boolean> {
  act.setSubmitting(true);

  try {
    await api.deleteRecipe({ id });
    act.removeRecipe(id);
    return true;
  } catch {
    return false;
  } finally {
    act.setSubmitting(false);
  }
}
