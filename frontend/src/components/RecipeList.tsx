import { useAppSelector } from '../store/hooks';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';

function RecipeList() {
  const recipesMap = useAppSelector((state) => state.recipes.recipes);
  const loading = useAppSelector((state) => state.recipes.loading);

  const recipes = Object.values(recipesMap).sort((a, b) => a.title.localeCompare(b.title));

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">Loading...</p>
      </div>
    );
      }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No recipes found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipeList;
