import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteRecipe } from '../store/recipeSlice';
import IngredientList from './IngredientList';
import StepList from './StepList';

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const recipe = useAppSelector((state) =>
    state.recipes.recipes.find((r) => r.id === id)
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      dispatch(deleteRecipe(id!));
      navigate('/recipes');
    }
  };

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Recipe Not Found
        </h2>
        <p className="text-slate-600 mb-6">
          The recipe you're looking for doesn't exist.
        </p>
        <Link
          to="/recipes"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/recipes"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Recipes
      </Link>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {recipe.title}
            </h2>
            {recipe.description && (
              <p className="text-lg text-slate-600">{recipe.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/recipes/${id}/edit`}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <IngredientList ingredients={recipe.ingredients} />
        </div>
        <div className="lg:col-span-2">
          <StepList steps={recipe.steps} />
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
