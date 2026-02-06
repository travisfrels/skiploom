import type { Ingredient } from '../types';
import Card from './Card';

interface IngredientListProps {
  ingredients: Ingredient[];
}

function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Ingredients</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.orderIndex} className="flex items-baseline gap-2">
            <span className="font-medium text-slate-700">
              {ingredient.amount} {ingredient.unit}
            </span>
            <span className="text-slate-600">{ingredient.name}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default IngredientList;
