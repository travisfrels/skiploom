import type { Ingredient, RecipeCategory, Step } from '../types';
import { RECIPE_CATEGORIES } from '../types';

export interface ImportRecipeData {
  title: string;
  description: string;
  category: RecipeCategory | '';
  ingredients: Ingredient[];
  steps: Step[];
}

export type ParseResult =
  | { success: true; data: ImportRecipeData }
  | { success: false; error: string };

const VALID_CATEGORIES = new Set(RECIPE_CATEGORIES.map((c) => c.value));

export function parseRecipeFragment(hash: string): ParseResult {
  const stripped = hash.startsWith('#') ? hash.slice(1) : hash;

  if (!stripped.startsWith('data=')) {
    return { success: false, error: 'No recipe data found in URL.' };
  }

  const encoded = stripped.slice('data='.length);

  let json: string;
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    json = new TextDecoder().decode(bytes);
  } catch {
    return { success: false, error: 'Unable to decode recipe data.' };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { success: false, error: 'Unable to parse recipe data.' };
  }

  if (typeof raw !== 'object' || raw === null) {
    return { success: false, error: 'Invalid recipe data format.' };
  }

  const obj = raw as Record<string, unknown>;

  const title = typeof obj.title === 'string' ? obj.title : '';
  const description = typeof obj.description === 'string' ? obj.description : '';

  const rawCategory = typeof obj.category === 'string' ? obj.category : '';
  const category = VALID_CATEGORIES.has(rawCategory as RecipeCategory)
    ? (rawCategory as RecipeCategory)
    : '';

  const rawIngredients = Array.isArray(obj.ingredients) ? obj.ingredients : [];
  const ingredients: Ingredient[] = rawIngredients.map((item: unknown, index: number) => {
    const ing = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};
    return {
      orderIndex: index + 1,
      amount: typeof ing.amount === 'number' ? ing.amount : 0,
      unit: typeof ing.unit === 'string' ? ing.unit : '',
      name: typeof ing.name === 'string' ? ing.name : '',
    };
  });

  const rawSteps = Array.isArray(obj.steps) ? obj.steps : [];
  const steps: Step[] = rawSteps.map((item: unknown, index: number) => {
    const step = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};
    return {
      orderIndex: index + 1,
      instruction: typeof step.instruction === 'string' ? step.instruction : '',
    };
  });

  return {
    success: true,
    data: { title, description, category, ingredients, steps },
  };
}
