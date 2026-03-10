import type { UpdateMealPlanEntryCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function updateMealPlanEntry(command: UpdateMealPlanEntryCommand): Promise<boolean> {
  act.clearMealPlanValidationErrors();
  act.setNotificationError(null);
  act.setNotificationSuccess(null);
  act.setMealPlanSubmitting(true);

  try {
    const response = await api.updateMealPlanEntry(command);
    act.updateMealPlanEntry(response.entry);
    act.setNotificationSuccess('Meal plan entry updated successfully');
    return true;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setMealPlanValidationErrors(err.errors);
    } else {
      act.setNotificationError(err instanceof Error ? err.message : 'Failed to update meal plan entry');
    }
    return false;
  } finally {
    act.setMealPlanSubmitting(false);
  }
}
