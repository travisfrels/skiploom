import ButtonLink from './ButtonLink';
import RecipeList from './RecipeList';

function Recipes() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Family Recipes</h2>
        <ButtonLink variant="primary" to="/recipes/new">
          Add Recipe
        </ButtonLink>
      </div>
        <RecipeList />
    </div>
  );
}

export default Recipes;
