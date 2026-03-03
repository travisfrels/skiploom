import type { Ingredient } from '../types';
import { useAppSelector } from '../store/hooks';
import { decimalToFractionString } from '../utils/fractions';
import Card from './Card';

interface IngredientListProps {
  ingredients: Ingredient[];
}

function IngredientList({ ingredients }: IngredientListProps) {
  const fractionAmounts = useAppSelector(
    (state) => state.featureFlags.featureFlags.FRACTION_AMOUNTS ?? false
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Ingredients</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.orderIndex} className="flex items-baseline gap-2">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {fractionAmounts ? decimalToFractionString(ingredient.amount) : ingredient.amount}{' '}
              {ingredient.unit}
            </span>
            <span className="text-slate-600 dark:text-slate-300">{ingredient.name}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default IngredientList;
