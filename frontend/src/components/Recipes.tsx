import { Link } from 'react-router-dom';
import RecipeList from './RecipeList';

function Recipes() {
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
        <RecipeList />
    </div>
  );
}

export default Recipes;
