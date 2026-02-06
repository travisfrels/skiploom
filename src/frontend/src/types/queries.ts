import type { Recipe } from './entities';

export interface FetchAllRecipesResponse {
    recipes: Recipe[];
    message: string;
}

export interface FetchRecipeByIdQuery {
    id: string;
}

export interface FetchRecipeByIdResponse {
    recipe: Recipe;
    message: string;
}
