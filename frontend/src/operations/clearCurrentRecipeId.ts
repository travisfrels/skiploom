import * as act from '../store/actions';

export function clearCurrentRecipeId(): void {
  act.clearCurrentRecipeId();
  act.clearValidationErrors();
}
