import type { CreateMealPlanEntryCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function createMealPlanEntry(command: CreateMealPlanEntryCommand): Promise<string | null> {
  act.clearMealPlanValidationErrors();
  act.setNotificationError(null);
  act.setNotificationSuccess(null);
  act.setMealPlanSubmitting(true);

  try {
    const response = await api.createMealPlanEntry(command);
    act.addMealPlanEntry(response.entry);
    act.setNotificationSuccess('Meal plan entry created successfully');
    return response.entry.id;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setMealPlanValidationErrors(err.errors);
    } else {
      act.setNotificationError(err instanceof Error ? err.message : 'Failed to create meal plan entry');
    }
    return null;
  } finally {
    act.setMealPlanSubmitting(false);
  }
}
