import { Link } from 'react-router-dom';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="block bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {recipe.title}
      </h3>
      {recipe.category && (
        <span className="inline-block text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 rounded px-2 py-0.5 mb-2">
          {RECIPE_CATEGORIES.find((c) => c.value === recipe.category)?.label}
        </span>
      )}
      {recipe.description && (
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{recipe.description}</p>
      )}
      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>{recipe.ingredients.length} ingredients</span>
        <span>{recipe.steps.length} steps</span>
      </div>
    </Link>
  );
}

export default RecipeCard;
