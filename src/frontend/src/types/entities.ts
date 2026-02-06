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

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: Step[];
}
