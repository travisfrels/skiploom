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

  describe('Fraction amounts', () => {
    it('renders text input for ingredient amount when FRACTION_AMOUNTS is enabled', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/new'],
          preloadedState: {
            featureFlags: { featureFlags: { FRACTION_AMOUNTS: true } },
          },
        }
      );
      const amountInput = screen.getByPlaceholderText('Amt');
      expect(amountInput).toHaveAttribute('type', 'text');
    });

    it('renders number input for ingredient amount when FRACTION_AMOUNTS is disabled', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/new'],
          preloadedState: {
            featureFlags: { featureFlags: { FRACTION_AMOUNTS: false } },
          },
        }
      );
      const amountInput = screen.getByPlaceholderText('Amt');
      expect(amountInput).toHaveAttribute('type', 'number');
    });

    it('renders number input for ingredient amount when flag is not set', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      const amountInput = screen.getByPlaceholderText('Amt');
      expect(amountInput).toHaveAttribute('type', 'number');
    });

    it('accepts fraction notation in text input when flag is enabled', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/new'],
          preloadedState: {
            featureFlags: { featureFlags: { FRACTION_AMOUNTS: true } },
          },
        }
      );
      const amountInput = screen.getByPlaceholderText('Amt');
      await user.clear(amountInput);
      await user.type(amountInput, '1/2');
      expect(amountInput).toHaveValue('1/2');
    });

    it('pre-populates amount as fraction string when editing with flag enabled', async () => {
      const testRecipe = {
        id: 'test-1',
        title: 'Test Recipe',
        description: '',
        ingredients: [{ orderIndex: 1, amount: 0.5, unit: 'cup', name: 'sugar' }],
        steps: [{ orderIndex: 1, instruction: 'Mix' }],
      };
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: {
            featureFlags: { featureFlags: { FRACTION_AMOUNTS: true } },
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
        const amountInput = screen.getByPlaceholderText('Amt');
        expect(amountInput).toHaveValue('1/2');
      });
    });

    it('pre-populates amount as decimal when editing with flag disabled', async () => {
      const testRecipe = {
        id: 'test-1',
        title: 'Test Recipe',
        description: '',
        ingredients: [{ orderIndex: 1, amount: 0.5, unit: 'cup', name: 'sugar' }],
        steps: [{ orderIndex: 1, instruction: 'Mix' }],
      };
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: {
            featureFlags: { featureFlags: { FRACTION_AMOUNTS: false } },
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
        const amountInput = screen.getByPlaceholderText('Amt');
        expect(amountInput).toHaveValue(0.5);
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
