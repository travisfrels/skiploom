import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Recipes from './Recipes';
import { renderWithProviders } from '../test/testUtils';
import type { RecipeSummary } from '../types';

const mockSummaries: RecipeSummary[] = [
  {
    id: '1',
    title: "Grandma's Chocolate Chip Cookies",
    description: 'The classic family recipe passed down for generations.',
    ingredientCount: 9,
    stepCount: 7,
  },
  {
    id: '2',
    title: "Mom's Chicken Noodle Soup",
    description: 'The perfect comfort food for cold days.',
    ingredientCount: 10,
    stepCount: 7,
  },
];

describe('Recipes', () => {
  it('renders page title', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipeSummaries: mockSummaries, recipesLoaded: true } },
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
        preloadedState: { recipes: { recipeSummaries: mockSummaries, recipesLoaded: true } },
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
        preloadedState: { recipes: { recipeSummaries: [], recipesLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Add Recipe')).toBeInTheDocument();
    });
  });
});
