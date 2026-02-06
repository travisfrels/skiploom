import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import RecipeDetail from './RecipeDetail';
import { renderWithProviders } from '../test/testUtils';
import type { Recipe } from '../types';

const testRecipe: Recipe = {
  id: '1',
  title: "Grandma's Chocolate Chip Cookies",
  description: 'The classic family recipe passed down for generations.',
  ingredients: [
    { id: '1-1', amount: 2.25, unit: 'cups', name: 'all-purpose flour' },
    { id: '1-2', amount: 1, unit: 'tsp', name: 'baking soda' },
  ],
  steps: [
    { id: '1-s1', orderIndex: 1, instruction: 'Preheat oven to 375°F.' },
    { id: '1-s2', orderIndex: 2, instruction: 'Mix dry ingredients.' },
  ],
};

describe('RecipeDetail', () => {
  it('renders recipe title', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: { '1': testRecipe }, currentRecipeId: '1', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText("Grandma's Chocolate Chip Cookies")).toBeInTheDocument();
    });
  });

  it('renders recipe description', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: { '1': testRecipe }, currentRecipeId: '1', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(
        screen.getByText(/The classic family recipe passed down for generations/)
      ).toBeInTheDocument();
    });
  });

  it('renders ingredients section', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: { '1': testRecipe }, currentRecipeId: '1', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('all-purpose flour')).toBeInTheDocument();
    });
  });

  it('renders instructions section', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: { '1': testRecipe }, currentRecipeId: '1', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByText(/Preheat oven/)).toBeInTheDocument();
    });
  });

  it('renders disabled edit and delete buttons', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: { '1': testRecipe }, currentRecipeId: '1', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('renders not found for invalid recipe id', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/invalid-id'],
        preloadedState: { recipes: { recipes: {}, currentRecipeId: 'invalid-id', error: 'Recipe not found', loading: false, recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Recipe Not Found')).toBeInTheDocument();
    });
  });

  it('renders back link on not found page', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/invalid-id'],
        preloadedState: { recipes: { recipes: {}, currentRecipeId: 'invalid-id', error: 'Recipe not found', loading: false, recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
    });
  });
});
