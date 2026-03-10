import type { MealPlanEntry, MealType, Recipe, ShoppingList } from './entities';

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

export type CreateShoppingListCommand = ShoppingList;

export interface CreateShoppingListResponse {
  list: ShoppingList;
  message: string;
}

export type UpdateShoppingListCommand = ShoppingList;

export interface UpdateShoppingListResponse {
  list: ShoppingList;
  message: string;
}

export interface DeleteShoppingListCommand {
  id: string;
}

export interface DeleteShoppingListResponse {
  message: string;
}
