import type { Recipe, ValidationError } from '../types';
import { store } from './index';
import * as slice from './recipeSlice';

export function setLoading(loading: boolean): void {
  store.dispatch(slice.setLoading(loading));
}

export function setError(error: string | null): void {
  store.dispatch(slice.setError(error));
}

export function setSuccess(success: string | null): void {
  store.dispatch(slice.setSuccess(success));
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
