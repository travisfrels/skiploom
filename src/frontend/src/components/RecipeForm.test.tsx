import { describe, it, expect } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import RecipeForm from './RecipeForm';
import { renderWithProviders } from '../test/testUtils';
import * as slice from '../store/recipeSlice';

describe('RecipeForm', () => {
  describe('Create mode', () => {
    it('renders new recipe form', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      expect(screen.getByText('New Recipe')).toBeInTheDocument();
    });

    it('shows validation errors from state', async () => {
      const { store } = renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );

      // Set validation errors after component mounts (simulating failed submission)
      act(() => {
        store.dispatch(slice.setValidationErrors([
          { field: 'title', message: 'Title is required' },
          { field: 'ingredients', message: 'At least one ingredient is required' },
        ]));
      });

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(screen.getByText('At least one ingredient is required')).toBeInTheDocument();
      });
    });

    it('allows adding ingredients', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );

      await user.click(screen.getByText('+ Add Ingredient'));

      const nameInputs = screen.getAllByPlaceholderText('Ingredient name');
      expect(nameInputs).toHaveLength(2);
    });

    it('allows adding steps', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );

      await user.click(screen.getByText('+ Add Step'));

      const stepInputs = screen.getAllByPlaceholderText('Describe this step');
      expect(stepInputs).toHaveLength(2);
    });

    it('renders back to recipes link', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
    });
  });

  describe('Dark mode', () => {
    it('applies dark mode classes to form heading', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      const heading = screen.getByText('New Recipe');
      expect(heading.className).toContain('dark:text-slate-100');
    });

    it('applies dark mode classes to form inputs', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      const titleInput = screen.getByPlaceholderText('Recipe title');
      expect(titleInput.className).toContain('dark:bg-slate-800');
      expect(titleInput.className).toContain('dark:border-slate-600');
    });

    it('applies dark mode error border when validation fails', async () => {
      const { store } = renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );

      act(() => {
        store.dispatch(slice.setValidationErrors([
          { field: 'ingredients[0].amount', message: 'Amount is required' },
        ]));
      });

      await waitFor(() => {
        const amountInput = screen.getByPlaceholderText('Amt');
        expect(amountInput.className).toContain('dark:border-red-400');
      });
    });
  });

  describe('Edit mode', () => {
    it('shows not found when recipe does not exist', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: {
            recipes: {
              recipes: {},
              recipesLoaded: true,
              currentRecipeId: null,
              loading: false,
              error: null,
              validationErrors: [],
              submitting: false,
            },
          },
        }
      );

      expect(screen.getByText('Recipe not found.')).toBeInTheDocument();
    });

    it('renders edit form header', async () => {
      const testRecipe = {
        id: 'test-1',
        title: 'Test Recipe',
        description: 'A test description',
        ingredients: [{ orderIndex: 1, amount: 2, unit: 'cups', name: 'flour' }],
        steps: [{ orderIndex: 1, instruction: 'Mix ingredients' }],
      };
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: {
            recipes: {
              recipes: { 'test-1': testRecipe },
              recipesLoaded: true,
              currentRecipeId: 'test-1',
              loading: false,
              error: null,
              validationErrors: [],
              submitting: false,
            },
          },
        }
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
      });
    });
  });
});
