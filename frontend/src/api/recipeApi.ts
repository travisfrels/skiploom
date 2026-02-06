import type { Recipe, RecipeSummary } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  ingredients: { amount: number; unit: string; name: string }[];
  steps: { orderIndex: number; instruction: string }[];
}

export interface UpdateRecipeRequest {
  title: string;
  description?: string;
  ingredients: { amount: number; unit: string; name: string }[];
  steps: { orderIndex: number; instruction: string }[];
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  errors: { field: string; message: string }[];
}

export async function fetchRecipes(): Promise<RecipeSummary[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export async function fetchRecipeById(id: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Recipe not found');
    }
    throw new Error('Failed to fetch recipe');
  }
  return response.json();
}

export async function createRecipe(request: CreateRecipeRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    if (response.status === 400) {
      const error: ValidationErrorResponse = await response.json();
      throw new ValidationError(error.errors);
    }
    throw new Error('Failed to create recipe');
  }
  const data = await response.json();
  return data.id;
}

export async function updateRecipe(id: string, request: UpdateRecipeRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    if (response.status === 400) {
      const error: ValidationErrorResponse = await response.json();
      throw new ValidationError(error.errors);
    }
    if (response.status === 404) {
      throw new Error('Recipe not found');
    }
    throw new Error('Failed to update recipe');
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Recipe not found');
    }
    throw new Error('Failed to delete recipe');
  }
}

export class ValidationError extends Error {
  constructor(public errors: { field: string; message: string }[]) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}
