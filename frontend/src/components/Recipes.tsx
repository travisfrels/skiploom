import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadRecipes } from '../store/recipeSlice';
import RecipeList from './RecipeList';

function Recipes() {
  const dispatch = useAppDispatch();
  const { recipeSummaries, recipesLoaded, loading, error } = useAppSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    if (!recipesLoaded) {
      dispatch(loadRecipes());
    }
  }, [dispatch, recipesLoaded]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Family Recipes</h2>
        <Link
          to="/recipes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Recipe
        </Link>
      </div>
      {loading && recipeSummaries.length === 0 && (
        <p className="text-slate-600">Loading recipes...</p>
      )}
      {error && <p className="text-red-600">Error: {error}</p>}
      {(!loading || recipeSummaries.length > 0) && (
        <RecipeList recipes={recipeSummaries} />
      )}
    </div>
  );
}

export default Recipes;
