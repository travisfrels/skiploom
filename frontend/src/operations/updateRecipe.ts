import type { Recipe } from '../types';
import * as api from '../api/recipeApi';
import * as act from '../store/actions';

export async function updateRecipe(recipe: Recipe): Promise<boolean> {
  act.clearValidationErrors();
  act.setSubmitting(true);

  try {
    await api.updateRecipe({ recipe });
    act.updateRecipe(recipe);
    return true;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setValidationErrors(err.errors);
    }
    return false;
  } finally {
    act.setSubmitting(false);
  }
}
