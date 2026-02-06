import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import type { Ingredient, Step } from '../types';
import BackLink from './BackLink';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Card from './Card';

interface RecipeFormProps {
  mode: 'new' | 'edit';
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
    { orderIndex: 1, amount: 1, unit: '', name: '' }
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { orderIndex: 1, instruction: '' },
  ]);

  const navigate = useNavigate();

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message;
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
      { orderIndex: ingredients.length + 1, amount: 1, unit: '', name: '' },
    ]);
  };

  const removeIngredient = (orderIndex: number) => {
    if (ingredients.length > 1) {
      setIngredients(
        ingredients
          .filter((i) => i.orderIndex !== orderIndex)
          .map((i, index) => ({ ...i, orderIndex: index + 1 }))
      );
    }
  };

  const updateIngredient = (
    orderIndex: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    setIngredients(
      ingredients.map((i) => (i.orderIndex === orderIndex ? { ...i, [field]: value } : i))
    );
  };

  const addStep = () => {
    setSteps([...steps, { orderIndex: steps.length + 1, instruction: '' }]);
  };

  const removeStep = (orderIndex: number) => {
    if (steps.length > 1) {
      setSteps(
        steps
          .filter((s) => s.orderIndex !== orderIndex)
          .map((s, index) => ({ ...s, orderIndex: index + 1 }))
      );
    }
  };

  const updateStep = (orderIndex: number, instruction: string) => {
    setSteps(
      steps.map((s) => (s.orderIndex === orderIndex ? { ...s, instruction } : s))
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submittedIngredients = ingredients
      .map((i, index) => ({
        orderIndex: index + 1,
        amount: i.amount,
        unit: i.unit.trim(),
        name: i.name.trim(),
      }));

    const submittedSteps = steps
      .map((s, index) => ({
        orderIndex: index + 1,
        instruction: s.instruction.trim(),
      }));

    const validRecipe = {
      id: id || '',
      title: title.trim(),
      description: description.trim() || undefined,
      ingredients: submittedIngredients,
      steps: submittedSteps,
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
      <BackLink to="/recipes">Back to Recipes</BackLink>

      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        {mode === 'edit' ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="space-y-4">
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
        </Card>

        <Card>
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
            {ingredients.map((ingredient, index) => (
              <div key={ingredient.orderIndex}>
                <div className="flex gap-3 items-start">
                  <input
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) =>
                      updateIngredient(
                        ingredient.orderIndex,
                        'amount',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getFieldError(`ingredients[${index}].amount`) ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Amt"
                    min="0"
                    step="0.25"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(ingredient.orderIndex, 'unit', e.target.value)
                    }
                    className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getFieldError(`ingredients[${index}].unit`) ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Unit"
                  />
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(ingredient.orderIndex, 'name', e.target.value)
                    }
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getFieldError(`ingredients[${index}].name`) ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Ingredient name"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.orderIndex)}
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
                {getFieldError(`ingredients[${index}].amount`) && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError(`ingredients[${index}].amount`)}</p>
                )}
                {getFieldError(`ingredients[${index}].unit`) && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError(`ingredients[${index}].unit`)}</p>
                )}
                {getFieldError(`ingredients[${index}].name`) && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError(`ingredients[${index}].name`)}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
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
              <div key={step.orderIndex}>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {step.orderIndex}
                  </span>
                  <textarea
                    value={step.instruction}
                    onChange={(e) => updateStep(step.orderIndex, e.target.value)}
                    rows={2}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getFieldError(`steps[${index}].instruction`) ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Describe this step"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(step.orderIndex)}
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
                {getFieldError(`steps[${index}].instruction`) && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError(`steps[${index}].instruction`)}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Recipe')}
          </Button>
          <ButtonLink variant="secondary" to="/recipes">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
