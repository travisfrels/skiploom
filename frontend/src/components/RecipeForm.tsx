import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import type { Ingredient, Step } from '../types';

interface RecipeFormProps {
  mode: 'new' | 'edit';
}

function generateTempId() {
  return crypto.randomUUID();
}

function RecipeForm({ mode }: RecipeFormProps) {
  const { id } = useParams<{ id: string }>();

  const currentRecipe = useAppSelector((state) => state.recipes.currentRecipeId
    ? state.recipes.recipes[state.recipes.currentRecipeId]
    : null
  );

  const submitting = useAppSelector((state) => state.recipes.submitting);
  const validationErrors = useAppSelector((state) => state.recipes.validationErrors);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: generateTempId(), amount: 1, unit: '', name: '' }
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { id: generateTempId(), orderIndex: 1, instruction: '' },
  ]);

  const navigate = useNavigate();

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field || e.field.startsWith(field + '['))?.message;
  };

  useEffect(() => {
    if (id && mode === 'edit') { ops.setCurrentRecipeId(id); }
    else { ops.clearCurrentRecipeId(); }
    return () => { ops.clearCurrentRecipeId(); };
  }, [id, mode]);

  useEffect(() => {
    if (currentRecipe) {
      setTitle(currentRecipe.title || '');
      setDescription(currentRecipe.description || '');
      setIngredients(structuredClone(currentRecipe.ingredients));
      setSteps(structuredClone(currentRecipe.steps));
    }
  }, [currentRecipe]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: generateTempId(), amount: 1, unit: '', name: '' },
    ]);
  };

  const removeIngredient = (ingredientId: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((i) => i.id !== ingredientId));
    }
  };

  const updateIngredient = (
    ingredientId: string,
    field: keyof Ingredient,
    value: string | number
  ) => {
    setIngredients(
      ingredients.map((i) => (i.id === ingredientId ? { ...i, [field]: value } : i))
    );
  };

  const addStep = () => {
    setSteps([...steps, { id: generateTempId(), orderIndex: steps.length + 1, instruction: '' }]);
  };

  const removeStep = (stepId: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((s) => s.id !== stepId));
    }
  };

  const updateStep = (stepId: string, instruction: string) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, instruction } : s))
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validIngredients = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        id: i.id,
        amount: i.amount,
        unit: i.unit.trim(),
        name: i.name.trim(),
      }));

    const validSteps = steps
      .filter((s) => s.instruction.trim())
      .map((s, index) => ({
        id: s.id,
        orderIndex: index + 1,
        instruction: s.instruction.trim(),
      }));

    const validRecipe = {
      id: id || '',
      title: title.trim(),
      description: description.trim() || undefined,
      ingredients: validIngredients,
      steps: validSteps,
    };

    if (mode === 'edit') {
      if (await ops.updateRecipe(validRecipe)) { navigate(`/recipes/${id}`); }
    } else {
      const newId = await ops.createRecipe({ recipe: validRecipe });
      if (newId) { navigate(`/recipes/${newId}`); }
    }
  };

  if (mode === 'edit' && !currentRecipe) { return (<div><p>Recipe not found.</p></div>); }

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

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        {mode === 'edit' ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Recipe title"
            />
            {getFieldError('title') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="A brief description of the recipe"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Ingredients *
            </h3>
            <button
              type="button"
              onClick={addIngredient}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              + Add Ingredient
            </button>
          </div>

          {getFieldError('ingredients') && (
            <p className="mb-4 text-sm text-red-600">{getFieldError('ingredients')}</p>
          )}

          <div className="space-y-3">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex gap-3 items-start">
                <input
                  type="number"
                  value={ingredient.amount}
                  onChange={(e) =>
                    updateIngredient(
                      ingredient.id,
                      'amount',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Amt"
                  min="0"
                  step="0.25"
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) =>
                    updateIngredient(ingredient.id, 'unit', e.target.value)
                  }
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Unit"
                />
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(ingredient.id, 'name', e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingredient name"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="p-2 text-slate-400 hover:text-red-600"
                  disabled={ingredients.length === 1}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Instructions *
            </h3>
            <button
              type="button"
              onClick={addStep}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              + Add Step
            </button>
          </div>

          {getFieldError('steps') && (
            <p className="mb-4 text-sm text-red-600">{getFieldError('steps')}</p>
          )}

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-medium text-sm">
                  {index + 1}
                </span>
                <textarea
                  value={step.instruction}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe this step"
                />
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="p-2 text-slate-400 hover:text-red-600"
                  disabled={steps.length === 1}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {submitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Recipe')}
          </button>
          <Link
            to="/recipes"
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
