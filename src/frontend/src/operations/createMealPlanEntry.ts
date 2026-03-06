import type { CreateMealPlanEntryCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function createMealPlanEntry(command: CreateMealPlanEntryCommand): Promise<string | null> {
  act.clearMealPlanValidationErrors();
  act.setMealPlanError(null);
  act.setMealPlanSuccess(null);
  act.setMealPlanSubmitting(true);

  try {
    const response = await api.createMealPlanEntry(command);
    act.addMealPlanEntry(response.entry);
    act.setMealPlanSuccess('Meal plan entry created successfully');
    return response.entry.id;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setMealPlanValidationErrors(err.errors);
    } else {
      act.setMealPlanError(err instanceof Error ? err.message : 'Failed to create meal plan entry');
    }
    return null;
  } finally {
    act.setMealPlanSubmitting(false);
  }
}
