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

export type MealType = 'BREAKFAST' | 'BRUNCH' | 'LUNCH' | 'DINNER' | 'SNACK';

export const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'BRUNCH', label: 'Brunch' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'SNACK', label: 'Snack' },
];

export interface MealPlanEntry {
  id: string;
  date: string;
  mealType: MealType;
  recipeId?: string;
  title: string;
  notes?: string;
}
