import type { CreateRecipeCommand } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function createRecipe(command: CreateRecipeCommand): Promise<string | null> {
  act.clearValidationErrors();
  act.setError(null);
  act.setSuccess(null);
  act.setSubmitting(true);

  try {
    const response = await api.createRecipe(command);
    act.addRecipe(response.recipe);
    act.setSuccess('Recipe created successfully');
    return response.recipe.id;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setValidationErrors(err.errors);
    } else {
      act.setError(err instanceof Error ? err.message : 'Failed to create recipe');
    }
    return null;
  } finally {
    act.setSubmitting(false);
  }
}
