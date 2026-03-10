import * as api from '../api';
import * as act from '../store/actions';

export async function deleteRecipe(id: string): Promise<boolean> {
  act.setNotificationError(null);
  act.setNotificationSuccess(null);
  act.setSubmitting(true);

  try {
    await api.deleteRecipe({ id });
    act.removeRecipe(id);
    act.setNotificationSuccess('Recipe deleted successfully');
    return true;
  } catch (err) {
    act.setNotificationError(err instanceof Error ? err.message : 'Failed to delete recipe');
    return false;
  } finally {
    act.setSubmitting(false);
  }
}
