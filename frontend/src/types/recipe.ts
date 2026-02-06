export interface Ingredient {
  id: string;
  amount: number;
  unit: string;
  name: string;
}

export interface Step {
  id: string;
  orderIndex: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: Step[];
}
