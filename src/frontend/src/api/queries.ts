import type {
    FetchAllRecipesResponse,
    FetchFeatureFlagsResponse,
    FetchMealPlanEntriesQuery,
    FetchMealPlanEntriesResponse,
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

export async function fetchFeatureFlags(): Promise<FetchFeatureFlagsResponse> {
  const response = await fetch(`${API_BASE_URL}/queries/fetch_feature_flags`);
  return handleResponse(response);
}

export async function fetchMealPlanEntries({ startDate, endDate }: FetchMealPlanEntriesQuery): Promise<FetchMealPlanEntriesResponse> {
  const response = await fetch(`${API_BASE_URL}/queries/fetch_meal_plan_entries?startDate=${startDate}&endDate=${endDate}`);
  return handleResponse(response);
}
