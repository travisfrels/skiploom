import type {
    FetchAllRecipesResponse,
    FetchRecipeByIdQuery,
    FetchRecipeByIdResponse,
    User
} from '../types';
import { API_BASE_URL, handleResponse } from './shared';

export async function fetchAllRecipes(): Promise<FetchAllRecipesResponse> {
  const response = await fetch(`${API_BASE_URL}/queries/fetch_all_recipes`);
  return handleResponse(response);
}

export async function fetchRecipeById({ id }: FetchRecipeByIdQuery): Promise<FetchRecipeByIdResponse> {
  const response = await fetch(`${API_BASE_URL}/queries/fetch_recipe_by_id/${id}`);
  return handleResponse(response);
}

export async function fetchMe(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/me`);
  return handleResponse(response);
}
