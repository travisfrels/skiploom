import type { Recipe } from './entities';

export interface ValidationError {
    field: string;
    message: string;
}

export interface BadRequestResponse {
  message: string;
  errors: ValidationError[];
}

export class ValidationFailedError extends Error {
  public readonly errors: ValidationError[];

  constructor(response: BadRequestResponse) {
    super(response.message);
    this.name = 'ValidationFailedError';
    this.errors = response.errors;
  }
}

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
    message: string;
}

export interface DeleteRecipeCommand {
    id: string;
}

export interface DeleteRecipeResponse {
    message: string;
}
