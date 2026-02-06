import type { CreateRecipeCommand } from '../types';
import * as api from '../api/recipeApi';
import * as act from '../store/actions';

export async function createRecipe(command: CreateRecipeCommand): Promise<string | null> {
  act.clearValidationErrors();
  act.setSubmitting(true);

  try {
    const response = await api.createRecipe(command);
    act.addRecipe(response.recipe);
    return response.recipe.id;
  } catch (err) {
    if (err instanceof api.ValidationFailedError) {
      act.setValidationErrors(err.errors);
    }
    return null;
  } finally {
    act.setSubmitting(false);
  }
}
