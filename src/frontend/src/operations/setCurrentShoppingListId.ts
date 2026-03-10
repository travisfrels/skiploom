import * as act from '../store/actions';

export function setCurrentShoppingListId(id: string): void {
  act.setCurrentShoppingListId(id);
  act.clearShoppingListValidationErrors();
}
