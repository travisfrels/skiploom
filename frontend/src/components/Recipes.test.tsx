import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Recipes from './Recipes';
import { renderWithProviders } from '../test/testUtils';
import { mockRecipes } from '../data/mockRecipes';

describe('Recipes', () => {
  it('renders page title', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText('Family Recipes')).toBeInTheDocument();
  });

  it('renders recipes from store', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText("Grandma's Chocolate Chip Cookies")).toBeInTheDocument();
    expect(screen.getByText("Mom's Chicken Noodle Soup")).toBeInTheDocument();
  });

  it('renders add recipe button', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>,
      {
        initialEntries: ['/recipes'],
        preloadedState: { recipes: { recipes: [] } },
      }
    );
    expect(screen.getByText('Add Recipe')).toBeInTheDocument();
  });
});
