import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as ops from '../operations';
import type { MealType } from '../types';
import { MEAL_TYPES } from '../types';
import BackLink from './BackLink';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Card from './Card';

interface MealPlanEntryFormProps {
  mode: 'new' | 'edit';
}

function MealPlanEntryForm({ mode }: MealPlanEntryFormProps) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const currentEntry = useAppSelector((state) =>
    id ? state.mealPlan.entries[id] : null
  );
  const recipes = useAppSelector((state) => state.recipes.recipes);
  const submitting = useAppSelector((state) => state.mealPlan.submitting);
  const validationErrors = useAppSelector((state) => state.mealPlan.validationErrors);

  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState<MealType | ''>('');
  const [entryMode, setEntryMode] = useState<'recipe' | 'adhoc'>('adhoc');
  const [recipeId, setRecipeId] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message;
  };

  useEffect(() => {
    if (mode === 'new') {
      const dateParam = searchParams.get('date');
      const mealTypeParam = searchParams.get('mealType');
      if (dateParam) setDate(dateParam);
      if (mealTypeParam) setMealType(mealTypeParam as MealType);
    }
  }, [mode, searchParams]);

  useEffect(() => {
    if (mode === 'edit' && currentEntry) {
      setDate(currentEntry.date);
      setMealType(currentEntry.mealType);
      setTitle(currentEntry.title);
      setNotes(currentEntry.notes || '');
      if (currentEntry.recipeId) {
        setEntryMode('recipe');
        setRecipeId(currentEntry.recipeId);
      } else {
        setEntryMode('adhoc');
        setRecipeId('');
      }
    }
  }, [mode, currentEntry]);

  const handleEntryModeChange = (newMode: 'recipe' | 'adhoc') => {
    setEntryMode(newMode);
    if (newMode === 'recipe') {
      setTitle('');
      setRecipeId('');
    } else {
      setRecipeId('');
    }
  };

  const handleRecipeChange = (selectedRecipeId: string) => {
    setRecipeId(selectedRecipeId);
    if (selectedRecipeId && recipes[selectedRecipeId]) {
      setTitle(recipes[selectedRecipeId].title);
    } else {
      setTitle('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === 'edit' && id) {
      const success = await ops.updateMealPlanEntry({
        id,
        date: date,
        mealType: mealType as MealType,
        recipeId: recipeId || undefined,
        title: title.trim(),
        notes: notes.trim() || undefined,
      });
      if (success) navigate('/meal-plan');
    } else {
      const newId = await ops.createMealPlanEntry({
        id: '',
        date: date,
        mealType: mealType as MealType,
        recipeId: recipeId || undefined,
        title: title.trim(),
        notes: notes.trim() || undefined,
      });
      if (newId) navigate('/meal-plan');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this meal plan entry?')) {
      if (await ops.deleteMealPlanEntry({ id })) {
        navigate('/meal-plan');
      }
    }
  };

  if (mode === 'edit' && !currentEntry) {
    return (<div><p>Meal plan entry not found.</p></div>);
  }

  const sortedRecipes = Object.values(recipes).sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div>
      <BackLink to="/meal-plan">Back to Meal Plan</BackLink>

      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
        {mode === 'edit' ? 'Edit Meal Plan Entry' : 'New Meal Plan Entry'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="space-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Date *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError('date') ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
            />
            {getFieldError('date') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('date')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="mealType"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Meal Type *
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType | '')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError('mealType') ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
            >
              <option value="">Select meal type...</option>
              {MEAL_TYPES.map((mt) => (
                <option key={mt.value} value={mt.value}>{mt.label}</option>
              ))}
            </select>
            {getFieldError('mealType') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('mealType')}</p>
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Entry Type
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="entryMode"
                  value="recipe"
                  checked={entryMode === 'recipe'}
                  onChange={() => handleEntryModeChange('recipe')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">Recipe</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="entryMode"
                  value="adhoc"
                  checked={entryMode === 'adhoc'}
                  onChange={() => handleEntryModeChange('adhoc')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">Ad-hoc</span>
              </label>
            </div>
          </div>

          {entryMode === 'recipe' && (
            <div>
              <label
                htmlFor="recipeSelection"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
              >
                Recipe Selection
              </label>
              <select
                id="recipeSelection"
                value={recipeId}
                onChange={(e) => handleRecipeChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
              >
                <option value="">Select a recipe...</option>
                {sortedRecipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                ))}
              </select>
            </div>
          )}

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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 ${getFieldError('title') ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
              placeholder="Meal title"
            />
            {getFieldError('title') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('title')}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800"
              placeholder="Optional notes"
            />
            {getFieldError('notes') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{getFieldError('notes')}</p>
            )}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Entry')}
          </Button>
          <ButtonLink variant="secondary" to="/meal-plan">
            Cancel
          </ButtonLink>
          {mode === 'edit' && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MealPlanEntryForm;
