import type { Recipe } from './entities';

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
