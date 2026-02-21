import type { Recipe, User, ValidationError } from '../types';
import { store } from './index';
import * as featureFlagSlice from './featureFlagSlice';
import * as slice from './recipeSlice';
import * as userSlice from './userSlice';

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
