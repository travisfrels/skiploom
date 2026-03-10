import * as act from '../store/actions';

export function clearCurrentShoppingListId(): void {
  act.clearCurrentShoppingListId();
  act.clearShoppingListValidationErrors();
}
