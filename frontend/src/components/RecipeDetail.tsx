import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import BackLink from './BackLink';
import Button from './Button';
import ButtonLink from './ButtonLink';
import IngredientList from './IngredientList';
import StepList from './StepList';

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = useAppSelector((state) => state.recipes.currentRecipeId
    ? state.recipes.recipes[state.recipes.currentRecipeId]
    : null
  );
  useEffect(() => {
    if (id) { ops.setCurrentRecipeId(id); }
    return () => { ops.clearCurrentRecipeId(); };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      if (await ops.deleteRecipe(id)) { navigate('/recipes'); }
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
      <BackLink to="/recipes">Back to Recipes</BackLink>

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
            <ButtonLink variant="secondary" to={`/recipes/${id}/edit`}>
              Edit
            </ButtonLink>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
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
