import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import RecipeForm from './RecipeForm';
import { renderWithProviders } from '../test/testUtils';

describe('RecipeForm', () => {
  describe('Create mode', () => {
    it('renders new recipe form', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      expect(screen.getByText('New Recipe')).toBeInTheDocument();
    });

    it('shows validation errors for empty form', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );

      await user.click(screen.getByText('Create Recipe'));

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('At least one ingredient is required')).toBeInTheDocument();
      expect(screen.getByText('At least one step is required')).toBeInTheDocument();
    });

    it('allows adding ingredients', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm />} />
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
          <Route path="/recipes/new" element={<RecipeForm />} />
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
          <Route path="/recipes/new" element={<RecipeForm />} />
        </Routes>,
        { initialEntries: ['/recipes/new'] }
      );
      expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
    });
  });

  describe('Edit mode', () => {
    it('shows loading state while fetching recipe', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: { recipes: { loading: true, recipesLoaded: true } },
        }
      );

      expect(screen.getByText('Loading recipe...')).toBeInTheDocument();
    });

    it('renders edit form header', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: {
            recipes: {
              currentRecipe: {
                id: 'test-1',
                title: 'Test Recipe',
                description: 'A test description',
                ingredients: [{ id: 'i1', amount: 2, unit: 'cups', name: 'flour' }],
                steps: [{ id: 's1', orderIndex: 1, instruction: 'Mix ingredients' }],
              },
              recipesLoaded: true,
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
