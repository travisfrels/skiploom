import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import RecipeForm from './RecipeForm';
import { renderWithProviders } from '../test/testUtils';
import type { Recipe } from '../types';

const mockRecipe: Recipe = {
  id: 'test-1',
  title: 'Test Recipe',
  description: 'A test description',
  ingredients: [{ id: 'i1', amount: 2, unit: 'cups', name: 'flour' }],
  steps: [{ id: 's1', orderIndex: 1, instruction: 'Mix ingredients' }],
};

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

    it('creates recipe and adds to store', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <Routes>
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<div>Recipe Detail</div>} />
        </Routes>,
        { initialEntries: ['/recipes/new'], preloadedState: { recipes: { recipes: [] } } }
      );

      await user.type(screen.getByPlaceholderText('Recipe title'), 'My New Recipe');
      await user.type(screen.getByPlaceholderText('Ingredient name'), 'Sugar');
      await user.type(screen.getByPlaceholderText('Describe this step'), 'Add sugar');
      await user.click(screen.getByText('Create Recipe'));

      await waitFor(() => {
        const state = store.getState();
        expect(state.recipes.recipes).toHaveLength(1);
        expect(state.recipes.recipes[0].title).toBe('My New Recipe');
      });
    });
  });

  describe('Edit mode', () => {
    it('renders edit form with existing data', () => {
      renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: { recipes: { recipes: [mockRecipe] } },
        }
      );

      expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Recipe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('A test description')).toBeInTheDocument();
    });

    it('updates recipe in store', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(
        <Routes>
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<div>Recipe Detail</div>} />
        </Routes>,
        {
          initialEntries: ['/recipes/test-1/edit'],
          preloadedState: { recipes: { recipes: [mockRecipe] } },
        }
      );

      const titleInput = screen.getByDisplayValue('Test Recipe');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Recipe');
      await user.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        const state = store.getState();
        expect(state.recipes.recipes[0].title).toBe('Updated Recipe');
      });
    });
  });
});
