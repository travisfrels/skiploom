export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface Ingredient {
  orderIndex: number;
  amount: number;
  unit: string;
  name: string;
}

export interface Step {
  orderIndex: number;
  instruction: string;
}

export type RecipeCategory =
  | 'MAIN'
  | 'SIDE'
  | 'DESSERT'
  | 'APPETIZER'
  | 'SOUP'
  | 'SALAD'
  | 'BREAKFAST'
  | 'SNACK'
  | 'COCKTAIL';

export const RECIPE_CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'MAIN', label: 'Main' },
  { value: 'SIDE', label: 'Side' },
  { value: 'DESSERT', label: 'Dessert' },
  { value: 'APPETIZER', label: 'Appetizer' },
  { value: 'SOUP', label: 'Soup' },
  { value: 'SALAD', label: 'Salad' },
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'SNACK', label: 'Snack' },
  { value: 'COCKTAIL', label: 'Cocktail' },
];

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  category?: RecipeCategory;
  ingredients: Ingredient[];
  steps: Step[];
}
