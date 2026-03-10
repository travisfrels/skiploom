import type { MealPlanEntry, Recipe, ShoppingList, User, ValidationError } from '../types';
import { store } from './index';
import * as featureFlagSlice from './featureFlagSlice';
import * as mealPlanSlice from './mealPlanSlice';
import * as notificationSlice from './notificationSlice';
import * as slice from './recipeSlice';
import * as shoppingListSlice from './shoppingListSlice';
import * as userSlice from './userSlice';

export function setLoading(loading: boolean): void {
  store.dispatch(slice.setLoading(loading));
}

export function setNotificationError(error: string | null): void {
  store.dispatch(notificationSlice.setError(error));
}

export function setNotificationSuccess(success: string | null): void {
  store.dispatch(notificationSlice.setSuccess(success));
}

export function clearNotifications(): void {
  store.dispatch(notificationSlice.clearNotifications());
}

export function setRecipes(recipes: Recipe[]): void {
  store.dispatch(slice.setRecipes(recipes));
}

export function setRecipesLoaded(loaded: boolean): void {
  store.dispatch(slice.setRecipesLoaded(loaded));
}

export function setCurrentRecipeId(id: string | null): void {
  store.dispatch(slice.setCurrentRecipeId(id));
}

export function clearCurrentRecipeId(): void {
  store.dispatch(slice.clearCurrentRecipeId());
}

export function addRecipe(recipe: Recipe): void {
  store.dispatch(slice.addRecipe(recipe));
}

export function updateRecipe(recipe: Recipe): void {
  store.dispatch(slice.updateRecipe(recipe));
}

export function removeRecipe(id: string): void {
  store.dispatch(slice.removeRecipe(id));
}

export function setSubmitting(submitting: boolean): void {
  store.dispatch(slice.setSubmitting(submitting));
}

export function setValidationErrors(errors: ValidationError[]): void {
  store.dispatch(slice.setValidationErrors(errors));
}

export function clearValidationErrors(): void {
  store.dispatch(slice.clearValidationErrors());
}

export function setUser(user: User | null): void {
  store.dispatch(userSlice.setUser(user));
}

export function setFeatureFlags(flags: Record<string, boolean>): void {
  store.dispatch(featureFlagSlice.setFeatureFlags(flags));
}

export function setFeatureFlagsLoaded(loaded: boolean): void {
  store.dispatch(featureFlagSlice.setFeatureFlagsLoaded(loaded));
}

export function setFeatureFlagLoading(loading: boolean): void {
  store.dispatch(featureFlagSlice.setFeatureFlagLoading(loading));
}

export function setFeatureFlagError(error: string | null): void {
  store.dispatch(featureFlagSlice.setFeatureFlagError(error));
}

export function setMealPlanLoading(loading: boolean): void {
  store.dispatch(mealPlanSlice.setLoading(loading));
}

export function setMealPlanEntries(entries: MealPlanEntry[]): void {
  store.dispatch(mealPlanSlice.setEntries(entries));
}

export function setMealPlanEntriesLoaded(loaded: boolean): void {
  store.dispatch(mealPlanSlice.setEntriesLoaded(loaded));
}

export function addMealPlanEntry(entry: MealPlanEntry): void {
  store.dispatch(mealPlanSlice.addEntry(entry));
}

export function updateMealPlanEntry(entry: MealPlanEntry): void {
  store.dispatch(mealPlanSlice.updateEntry(entry));
}

export function removeMealPlanEntry(id: string): void {
  store.dispatch(mealPlanSlice.removeEntry(id));
}

export function setMealPlanSubmitting(submitting: boolean): void {
  store.dispatch(mealPlanSlice.setSubmitting(submitting));
}

export function setMealPlanValidationErrors(errors: ValidationError[]): void {
  store.dispatch(mealPlanSlice.setValidationErrors(errors));
}

export function clearMealPlanValidationErrors(): void {
  store.dispatch(mealPlanSlice.clearValidationErrors());
}

export function setShoppingListLoading(loading: boolean): void {
  store.dispatch(shoppingListSlice.setLoading(loading));
}

export function setShoppingLists(lists: ShoppingList[]): void {
  store.dispatch(shoppingListSlice.setLists(lists));
}

export function setShoppingListsLoaded(loaded: boolean): void {
  store.dispatch(shoppingListSlice.setListsLoaded(loaded));
}

export function setCurrentShoppingListId(id: string | null): void {
  store.dispatch(shoppingListSlice.setCurrentListId(id));
}

export function clearCurrentShoppingListId(): void {
  store.dispatch(shoppingListSlice.clearCurrentListId());
}

export function addShoppingList(list: ShoppingList): void {
  store.dispatch(shoppingListSlice.addList(list));
}

export function updateShoppingList(list: ShoppingList): void {
  store.dispatch(shoppingListSlice.updateList(list));
}

export function removeShoppingList(id: string): void {
  store.dispatch(shoppingListSlice.removeList(id));
}

export function setShoppingListSubmitting(submitting: boolean): void {
  store.dispatch(shoppingListSlice.setSubmitting(submitting));
}

export function setShoppingListValidationErrors(errors: ValidationError[]): void {
  store.dispatch(shoppingListSlice.setValidationErrors(errors));
}

export function clearShoppingListValidationErrors(): void {
  store.dispatch(shoppingListSlice.clearValidationErrors());
}
