import { describe, it, expect } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import MealPlanEntryForm from './MealPlanEntryForm';
import { renderWithProviders } from '../test/testUtils';
import * as mealPlanSlice from '../store/mealPlanSlice';

const TEST_RECIPES = {
  'recipe-1': {
    id: 'recipe-1',
    title: 'Chicken Parmesan',
    description: 'Classic Italian dish',
    ingredients: [{ orderIndex: 1, amount: 1, unit: 'lb', name: 'chicken' }],
    steps: [{ orderIndex: 1, instruction: 'Cook chicken' }],
  },
  'recipe-2': {
    id: 'recipe-2',
    title: 'Grilled Salmon',
    description: 'Fresh salmon',
    ingredients: [{ orderIndex: 1, amount: 1, unit: 'fillet', name: 'salmon' }],
    steps: [{ orderIndex: 1, instruction: 'Grill salmon' }],
  },
};

const TEST_ENTRY = {
  id: 'entry-1',
  date: '2026-03-06',
  mealType: 'DINNER' as const,
  recipeId: 'recipe-1',
  title: 'Chicken Parmesan',
  notes: 'Extra cheese',
};

const TEST_ADHOC_ENTRY = {
  id: 'entry-2',
  date: '2026-03-07',
  mealType: 'LUNCH' as const,
  title: 'Leftovers',
  notes: '',
};

describe('MealPlanEntryForm', () => {
  describe('Create mode', () => {
    it('renders new meal plan entry heading', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );
      expect(screen.getByText('New Meal Plan Entry')).toBeInTheDocument();
    });

    it('renders date, meal type, entry mode, title, and notes fields', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );
      expect(screen.getByLabelText('Date *')).toBeInTheDocument();
      expect(screen.getByLabelText('Meal Type *')).toBeInTheDocument();
      expect(screen.getByLabelText('Recipe')).toBeInTheDocument();
      expect(screen.getByLabelText('Ad-hoc')).toBeInTheDocument();
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    });

    it('pre-fills date from query param', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new?date=2026-03-06'] }
      );
      expect(screen.getByLabelText('Date *')).toHaveValue('2026-03-06');
    });

    it('pre-fills meal type from query param', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new?mealType=DINNER'] }
      );
      expect(screen.getByLabelText('Meal Type *')).toHaveValue('DINNER');
    });

    it('pre-fills both date and meal type from query params', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new?date=2026-03-06&mealType=BREAKFAST'] }
      );
      expect(screen.getByLabelText('Date *')).toHaveValue('2026-03-06');
      expect(screen.getByLabelText('Meal Type *')).toHaveValue('BREAKFAST');
    });

    it('defaults to ad-hoc mode', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );
      expect(screen.getByLabelText('Ad-hoc')).toBeChecked();
      expect(screen.getByLabelText('Recipe')).not.toBeChecked();
    });

    it('shows recipe dropdown when recipe radio selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/new'],
          preloadedState: { recipes: { recipes: TEST_RECIPES, recipesLoaded: true } },
        }
      );

      await user.click(screen.getByLabelText('Recipe'));
      expect(screen.getByLabelText('Recipe Selection')).toBeInTheDocument();
    });

    it('hides recipe dropdown in ad-hoc mode', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/new'],
          preloadedState: { recipes: { recipes: TEST_RECIPES, recipesLoaded: true } },
        }
      );
      expect(screen.queryByLabelText('Recipe Selection')).not.toBeInTheDocument();
    });

    it('auto-fills title when recipe selected', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/new'],
          preloadedState: { recipes: { recipes: TEST_RECIPES, recipesLoaded: true } },
        }
      );

      await user.click(screen.getByLabelText('Recipe'));
      await user.selectOptions(screen.getByLabelText('Recipe Selection'), 'recipe-1');

      expect(screen.getByLabelText('Title *')).toHaveValue('Chicken Parmesan');
    });

    it('clears recipeId when switching from recipe to ad-hoc mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/new'],
          preloadedState: { recipes: { recipes: TEST_RECIPES, recipesLoaded: true } },
        }
      );

      await user.click(screen.getByLabelText('Recipe'));
      await user.selectOptions(screen.getByLabelText('Recipe Selection'), 'recipe-1');
      await user.click(screen.getByLabelText('Ad-hoc'));

      expect(screen.queryByLabelText('Recipe Selection')).not.toBeInTheDocument();
    });

    it('clears title when switching from ad-hoc to recipe mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/new'],
          preloadedState: { recipes: { recipes: TEST_RECIPES, recipesLoaded: true } },
        }
      );

      await user.type(screen.getByLabelText('Title *'), 'My Lunch');
      await user.click(screen.getByLabelText('Recipe'));

      expect(screen.getByLabelText('Title *')).toHaveValue('');
    });

    it('shows validation errors from state inline', async () => {
      const { store } = renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );

      act(() => {
        store.dispatch(mealPlanSlice.setValidationErrors([
          { field: 'date', message: 'Date is required.' },
          { field: 'mealType', message: 'Meal type is required.' },
          { field: 'title', message: 'Title is required.' },
        ]));
      });

      await waitFor(() => {
        expect(screen.getByText('Date is required.')).toBeInTheDocument();
        expect(screen.getByText('Meal type is required.')).toBeInTheDocument();
        expect(screen.getByText('Title is required.')).toBeInTheDocument();
      });
    });

    it('renders back to meal plan link', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );
      expect(screen.getByText('Back to Meal Plan')).toBeInTheDocument();
    });

    it('renders cancel link pointing to /meal-plan', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );
      const cancelLink = screen.getByText('Cancel').closest('a');
      expect(cancelLink).toHaveAttribute('href', '/meal-plan');
    });

    it('does not show delete button in new mode', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/meal-plan/new'] }
      );
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    });

    it('shows submitting state on button', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/new" element={<MealPlanEntryForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/new'],
          preloadedState: { mealPlan: { submitting: true } },
        }
      );
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  describe('Edit mode', () => {
    it('shows entry not found when entry does not exist in store', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/nonexistent/edit'],
          preloadedState: { mealPlan: { entries: {}, entriesLoaded: true } },
        }
      );
      expect(screen.getByText('Meal plan entry not found.')).toBeInTheDocument();
    });

    it('renders edit heading', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/entry-1/edit'],
          preloadedState: {
            mealPlan: { entries: { 'entry-1': TEST_ENTRY }, entriesLoaded: true },
            recipes: { recipes: TEST_RECIPES, recipesLoaded: true },
          },
        }
      );
      expect(screen.getByText('Edit Meal Plan Entry')).toBeInTheDocument();
    });

    it('pre-populates all fields from existing entry', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/entry-1/edit'],
          preloadedState: {
            mealPlan: { entries: { 'entry-1': TEST_ENTRY }, entriesLoaded: true },
            recipes: { recipes: TEST_RECIPES, recipesLoaded: true },
          },
        }
      );
      expect(screen.getByLabelText('Date *')).toHaveValue('2026-03-06');
      expect(screen.getByLabelText('Meal Type *')).toHaveValue('DINNER');
      expect(screen.getByLabelText('Title *')).toHaveValue('Chicken Parmesan');
      expect(screen.getByLabelText('Notes')).toHaveValue('Extra cheese');
    });

    it('sets entry mode to recipe when entry has recipeId', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/entry-1/edit'],
          preloadedState: {
            mealPlan: { entries: { 'entry-1': TEST_ENTRY }, entriesLoaded: true },
            recipes: { recipes: TEST_RECIPES, recipesLoaded: true },
          },
        }
      );
      expect(screen.getByLabelText('Recipe')).toBeChecked();
      expect(screen.getByLabelText('Recipe Selection')).toHaveValue('recipe-1');
    });

    it('sets entry mode to ad-hoc when entry has no recipeId', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/entry-2/edit'],
          preloadedState: {
            mealPlan: { entries: { 'entry-2': TEST_ADHOC_ENTRY }, entriesLoaded: true },
            recipes: { recipes: TEST_RECIPES, recipesLoaded: true },
          },
        }
      );
      expect(screen.getByLabelText('Ad-hoc')).toBeChecked();
      expect(screen.queryByLabelText('Recipe Selection')).not.toBeInTheDocument();
    });

    it('shows delete button in edit mode', () => {
      renderWithProviders(
        <Routes>
          <Route path="/meal-plan/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/meal-plan/entry-1/edit'],
          preloadedState: {
            mealPlan: { entries: { 'entry-1': TEST_ENTRY }, entriesLoaded: true },
            recipes: { recipes: TEST_RECIPES, recipesLoaded: true },
          },
        }
      );
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });
});
