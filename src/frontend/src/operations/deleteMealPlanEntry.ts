import type { DeleteMealPlanEntryCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function deleteMealPlanEntry(command: DeleteMealPlanEntryCommand): Promise<boolean> {
  act.setNotificationError(null);
  act.setNotificationSuccess(null);
  act.setMealPlanSubmitting(true);

  try {
    await api.deleteMealPlanEntry(command);
    act.removeMealPlanEntry(command.id);
    act.setNotificationSuccess('Meal plan entry deleted successfully');
    return true;
  } catch (err) {
    act.setNotificationError(err instanceof Error ? err.message : 'Failed to delete meal plan entry');
    return false;
  } finally {
    act.setMealPlanSubmitting(false);
  }
}
