import * as act from '../store/actions';

export function setCurrentRecipeId(id: string): void {
  act.setCurrentRecipeId(id);
  act.clearValidationErrors();
}
