import {
    ValidationFailedError,
    type CreateRecipeCommand,
    type CreateRecipeResponse,
    type DeleteRecipeCommand,
    type DeleteRecipeResponse,
    type FetchAllRecipesResponse,
    type FetchRecipeByIdQuery,
    type FetchRecipeByIdResponse,
    type UpdateRecipeCommand,
    type UpdateRecipeResponse
} from '../types';

export { ValidationFailedError };

const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchAllRecipes(): Promise<FetchAllRecipesResponse> {
  const response = await fetch(`${API_BASE_URL}/queries/fetch_all_recipes`);
  if (response.ok) return response.json();
  throw new Error('Failed to fetch recipes');
}

export async function fetchRecipeById({ id }: FetchRecipeByIdQuery): Promise<FetchRecipeByIdResponse> {
  const response = await fetch(`${API_BASE_URL}/queries/fetch_recipe_by_id/${id}`);
  if (response.ok) return response.json();
  if (response.status === 404) throw new Error('Recipe not found');
  throw new Error('Failed to fetch recipe');
}

export async function createRecipe(command: CreateRecipeCommand): Promise<CreateRecipeResponse> {
  const response = await fetch(`${API_BASE_URL}/commands/create_recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });

  if (response.ok) return await response.json();

  if (response.status === 400) throw new ValidationFailedError(await response.json());

  throw new Error(await response.json());
}

export async function updateRecipe(command: UpdateRecipeCommand): Promise<UpdateRecipeResponse> {
  const response = await fetch(`${API_BASE_URL}/commands/update_recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });

  if (response.ok) return await response.json();

  if (response.status === 400) throw new ValidationFailedError(await response.json());
  if (response.status === 404) throw new Error('Recipe not found');

  throw new Error(await response.json());
}

export async function deleteRecipe(command: DeleteRecipeCommand): Promise<DeleteRecipeResponse> {
  const response = await fetch(`${API_BASE_URL}/commands/delete_recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });

  if (response.ok) return await response.json();

  if (response.status === 404) throw new Error('Recipe not found');

  throw new Error(await response.json());
}
