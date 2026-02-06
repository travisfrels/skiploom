import type { Ingredient } from '../types';

interface IngredientListProps {
  ingredients: Ingredient[];
}

function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Ingredients</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex items-baseline gap-2">
            <span className="font-medium text-slate-700">
              {ingredient.amount} {ingredient.unit}
            </span>
            <span className="text-slate-600">{ingredient.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientList;
