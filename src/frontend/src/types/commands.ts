import type { MealPlanEntry, MealType, Recipe } from './entities';

export interface CreateRecipeCommand {
  recipe: Recipe;
}

export interface CreateRecipeResponse {
    recipe: Recipe;
    message: string;
}

export interface UpdateRecipeCommand {
  recipe: Recipe;
}

export interface UpdateRecipeResponse {
    recipe: Recipe;
    message: string;
}

export interface DeleteRecipeCommand {
    id: string;
}

export interface DeleteRecipeResponse {
    message: string;
}

export interface CreateMealPlanEntryCommand {
  id: string;
  date: string;
  mealType: MealType;
  recipeId?: string;
  title: string;
  notes?: string;
}

export interface CreateMealPlanEntryResponse {
  entry: MealPlanEntry;
  message: string;
}

export type UpdateMealPlanEntryCommand = MealPlanEntry;

export interface UpdateMealPlanEntryResponse {
  entry: MealPlanEntry;
  message: string;
}

export interface DeleteMealPlanEntryCommand {
  id: string;
}

export interface DeleteMealPlanEntryResponse {
  message: string;
}
