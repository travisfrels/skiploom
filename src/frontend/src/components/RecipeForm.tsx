import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import type { Ingredient, RecipeCategory, Step } from '../types';
import { RECIPE_CATEGORIES } from '../types';
import { decimalToFractionString, filterFractionInput, fractionStringToDecimal } from '../utils/fractions';
import { parseRecipeFragment } from '../utils/recipeImport';
import BackLink from './BackLink';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Card from './Card';

interface RecipeFormProps {
  mode: 'new' | 'edit' | 'import';
}

function RecipeForm({ mode }: RecipeFormProps) {
  const { id } = useParams<{ id: string }>();

  const currentRecipe = useAppSelector((state) => state.recipes.currentRecipeId
    ? state.recipes.recipes[state.recipes.currentRecipeId]
    : null
  );

  const fractionAmounts = useAppSelector(
    (state) => state.featureFlags.featureFlags.FRACTION_AMOUNTS ?? false
  );
  const submitting = useAppSelector((state) => state.recipes.submitting);
  const validationErrors = useAppSelector((state) => state.recipes.validationErrors);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecipeCategory | ''>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { orderIndex: 1, amount: 1, unit: '', name: '' }
  ]);
  const [amountText, setAmountText] = useState<Record<number, string>>({ 1: '1' });
  const [steps, setSteps] = useState<Step[]>([
    { orderIndex: 1, instruction: '' },
  ]);
  const [importError, setImportError] = useState<string | null>(null);

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
      setCategory(currentRecipe.category || '');
      setIngredients(structuredClone(currentRecipe.ingredients));
      setSteps(structuredClone(currentRecipe.steps));
      const textMap: Record<number, string> = {};
      for (const ing of currentRecipe.ingredients) {
        textMap[ing.orderIndex] = fractionAmounts
          ? decimalToFractionString(ing.amount)
          : String(ing.amount);
      }
      setAmountText(textMap);
    }
  }, [currentRecipe, fractionAmounts]);

  useEffect(() => {
    if (mode !== 'import') return;
    const result = parseRecipeFragment(window.location.hash);
    if (!result.success) {
      setImportError(result.error);
      return;
    }
    const { data } = result;
    setTitle(data.title);
    setDescription(data.description);
    setCategory(data.category);
    setIngredients(data.ingredients.length > 0 ? data.ingredients : [{ orderIndex: 1, amount: 1, unit: '', name: '' }]);
    setSteps(data.steps.length > 0 ? data.steps : [{ orderIndex: 1, instruction: '' }]);
    const textMap: Record<number, string> = {};
    for (const ing of data.ingredients) {
      textMap[ing.orderIndex] = fractionAmounts
        ? decimalToFractionString(ing.amount)
        : String(ing.amount);
    }
    setAmountText(textMap);
  }, [mode, fractionAmounts]);

  const addIngredient = () => {
    const newOrderIndex = ingredients.length + 1;
    setIngredients([
      ...ingredients,
      { orderIndex: newOrderIndex, amount: 1, unit: '', name: '' },
    ]);
    setAmountText((prev) => ({ ...prev, [newOrderIndex]: '1' }));
  };

  const removeIngredient = (orderIndex: number) => {
    if (ingredients.length > 1) {
      const filtered = ingredients.filter((i) => i.orderIndex !== orderIndex);
      const reindexed = filtered.map((i, index) => ({ ...i, orderIndex: index + 1 }));
      setIngredients(reindexed);
      const newText: Record<number, string> = {};
      filtered.forEach((original, index) => {
        newText[index + 1] = amountText[original.orderIndex] ?? String(original.amount);
      });
      setAmountText(newText);
    }
  };

  const updateAmountText = (orderIndex: number, text: string) => {
    setAmountText((prev) => ({ ...prev, [orderIndex]: filterFractionInput(text) }));
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
      .map((i, index) => {
        let amount: number;
        if (fractionAmounts) {
          const text = amountText[i.orderIndex] ?? '';
          const parsed = fractionStringToDecimal(text);
          amount = Number.isNaN(parsed) ? 0 : parsed;
        } else {
          amount = i.amount;
        }
        return {
          orderIndex: index + 1,
          amount,
          unit: i.unit.trim(),
          name: i.name.trim(),
        };
      });

    const submittedSteps = steps
      .map((s, index) => ({
        orderIndex: index + 1,
        instruction: s.instruction.trim(),
      }));

    const validRecipe = {
      id: id || '',
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
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

  if (mode === 'import' && importError) {
    return (
      <div>
        <BackLink to="/recipes">Back to Recipes</BackLink>
        <Card className="mt-6">
          <p className="text-red-600 dark:text-red-400">{importError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <BackLink to="/recipes">Back to Recipes</BackLink>

      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
        {mode === 'edit' ? 'Edit Recipe' : mode === 'import' ? 'Import Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
              placeholder="Recipe title"
            />
            {getFieldError('title') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('title')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
              placeholder="A brief description of the recipe"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as RecipeCategory | '')}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
            >
              <option value="">None</option>
              {RECIPE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Ingredients *
            </h3>
            <button
              type="button"
              onClick={addIngredient}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
            >
              + Add Ingredient
            </button>
          </div>

          {getFieldError('ingredients') && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">{getFieldError('ingredients')}</p>
          )}

          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={ingredient.orderIndex}>
                <div className="flex gap-3 items-start">
                  {fractionAmounts ? (
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9/ ]*"
                      value={amountText[ingredient.orderIndex] ?? ''}
                      onChange={(e) => updateAmountText(ingredient.orderIndex, e.target.value)}
                      className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError(`ingredients[${index}].amount`) ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
                      placeholder="Amt"
                    />
                  ) : (
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
                      className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError(`ingredients[${index}].amount`) ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
                      placeholder="Amt"
                      min="0"
                      step="0.25"
                    />
                  )}
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(ingredient.orderIndex, 'unit', e.target.value)
                    }
                    className={`w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError(`ingredients[${index}].unit`) ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
                    placeholder="Unit"
                  />
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(ingredient.orderIndex, 'name', e.target.value)
                    }
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError(`ingredients[${index}].name`) ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
                    placeholder="Ingredient name"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.orderIndex)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError(`ingredients[${index}].amount`)}</p>
                )}
                {getFieldError(`ingredients[${index}].unit`) && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError(`ingredients[${index}].unit`)}</p>
                )}
                {getFieldError(`ingredients[${index}].name`) && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError(`ingredients[${index}].name`)}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Instructions *
            </h3>
            <button
              type="button"
              onClick={addStep}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
            >
              + Add Step
            </button>
          </div>

          {getFieldError('steps') && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">{getFieldError('steps')}</p>
          )}

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.orderIndex}>
                <div className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 dark:bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {step.orderIndex}
                  </span>
                  <textarea
                    value={step.instruction}
                    onChange={(e) => updateStep(step.orderIndex, e.target.value)}
                    rows={2}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError(`steps[${index}].instruction`) ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
                    placeholder="Describe this step"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(step.orderIndex)}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400"
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError(`steps[${index}].instruction`)}</p>
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
            {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : mode === 'import' ? 'Import' : 'Create Recipe'}
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
