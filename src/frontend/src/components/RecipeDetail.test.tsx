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
    { orderIndex: 1, amount: 2.25, unit: 'cups', name: 'all-purpose flour' },
    { orderIndex: 2, amount: 1, unit: 'tsp', name: 'baking soda' },
  ],
  steps: [
    { orderIndex: 1, instruction: 'Preheat oven to 375°F.' },
    { orderIndex: 2, instruction: 'Mix dry ingredients.' },
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
        preloadedState: { recipes: { recipes: {}, currentRecipeId: 'invalid-id', recipesLoaded: true } },
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
        preloadedState: { recipes: { recipes: {}, currentRecipeId: 'invalid-id', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
    });
  });

  it('applies dark mode classes to not found state', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/invalid-id'],
        preloadedState: { recipes: { recipes: {}, currentRecipeId: 'invalid-id', recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      const heading = screen.getByText('Recipe Not Found');
      expect(heading.className).toContain('dark:text-slate-100');
      const message = screen.getByText("The recipe you're looking for doesn't exist.");
      expect(message.className).toContain('dark:text-slate-300');
    });
  });

  it('applies dark mode classes to recipe detail', async () => {
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
      const title = screen.getByText("Grandma's Chocolate Chip Cookies");
      expect(title.className).toContain('dark:text-slate-100');
      const description = screen.getByText(/The classic family recipe/);
      expect(description.className).toContain('dark:text-slate-300');
    });
  });
});
