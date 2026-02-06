import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addRecipe, updateRecipe } from '../store/recipeSlice';
import type { Recipe, Ingredient, Step } from '../types';

interface FormErrors {
  title?: string;
  ingredients?: string;
  steps?: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const existingRecipe = useAppSelector((state) =>
    id ? state.recipes.recipes.find((r) => r.id === id) : undefined
  );

  const isEditing = !!existingRecipe;

  const [title, setTitle] = useState(existingRecipe?.title ?? '');
  const [description, setDescription] = useState(
    existingRecipe?.description ?? ''
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    existingRecipe?.ingredients ?? [
      { id: generateId(), amount: 1, unit: '', name: '' },
    ]
  );
  const [steps, setSteps] = useState<Step[]>(
    existingRecipe?.steps ?? [
      { id: generateId(), orderIndex: 1, instruction: '' },
    ]
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: generateId(), amount: 1, unit: '', name: '' },
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
      ingredients.map((i) =>
        i.id === ingredientId ? { ...i, [field]: value } : i
      )
    );
  };

  const addStep = () => {
    const maxOrder = Math.max(...steps.map((s) => s.orderIndex), 0);
    setSteps([
      ...steps,
      { id: generateId(), orderIndex: maxOrder + 1, instruction: '' },
    ]);
  };

  const removeStep = (stepId: string) => {
    if (steps.length > 1) {
      const newSteps = steps
        .filter((s) => s.id !== stepId)
        .map((s, index) => ({ ...s, orderIndex: index + 1 }));
      setSteps(newSteps);
    }
  };

  const updateStep = (stepId: string, instruction: string) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, instruction } : s))
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    const validIngredients = ingredients.filter((i) => i.name.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    const validSteps = steps.filter((s) => s.instruction.trim());
    if (validSteps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim());
    const validSteps = steps
      .filter((s) => s.instruction.trim())
      .map((s, index) => ({ ...s, orderIndex: index + 1 }));

    const recipe: Recipe = {
      id: existingRecipe?.id ?? generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      ingredients: validIngredients,
      steps: validSteps,
    };

    if (isEditing) {
      dispatch(updateRecipe(recipe));
    } else {
      dispatch(addRecipe(recipe));
    }

    navigate(`/recipes/${recipe.id}`);
  };

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
        {isEditing ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title & Description */}
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
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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

        {/* Ingredients */}
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

          {errors.ingredients && (
            <p className="mb-4 text-sm text-red-600">{errors.ingredients}</p>
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

        {/* Steps */}
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

          {errors.steps && (
            <p className="mb-4 text-sm text-red-600">{errors.steps}</p>
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

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Create Recipe'}
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
