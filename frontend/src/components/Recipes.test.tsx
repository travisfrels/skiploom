import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Recipes from './Recipes';
import { renderWithProviders } from '../test/testUtils';
import type { Recipe } from '../types';

const mockRecipes: Record<string, Recipe> = {
  '1': {
    id: '1',
    title: "Grandma's Chocolate Chip Cookies",
    description: 'The classic family recipe passed down for generations.',
    ingredients: [{ id: 'i1', amount: 1, unit: 'cup', name: 'flour' }],
    steps: [{ id: 's1', orderIndex: 1, instruction: 'Mix' }],
  },
  '2': {
    id: '2',
    title: "Mom's Chicken Noodle Soup",
    description: 'The perfect comfort food for cold days.',
    ingredients: [{ id: 'i2', amount: 2, unit: 'cups', name: 'broth' }],
    steps: [{ id: 's2', orderIndex: 1, instruction: 'Boil' }],
  },
};

describe('Recipes', () => {
  it('renders page title', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipes: mockRecipes, recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Family Recipes')).toBeInTheDocument();
    });
  });

  it('renders recipes from store', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipes: mockRecipes, recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText("Grandma's Chocolate Chip Cookies")).toBeInTheDocument();
      expect(screen.getByText("Mom's Chicken Noodle Soup")).toBeInTheDocument();
    });
  });

  it('renders add recipe button', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipes: {}, recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Add Recipe')).toBeInTheDocument();
    });
  });
});
