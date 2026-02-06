import type { Recipe } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function updateRecipe(recipe: Recipe): Promise<boolean> {
  act.clearValidationErrors();
  act.setError(null);
  act.setSuccess(null);
  act.setSubmitting(true);

  try {
    const response = await api.updateRecipe({ recipe });
    act.updateRecipe(response.recipe);
    act.setSuccess('Recipe updated successfully');
    return true;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setValidationErrors(err.errors);
    } else {
      act.setError(err instanceof Error ? err.message : 'Failed to update recipe');
    }
    return false;
  } finally {
    act.setSubmitting(false);
  }
}
