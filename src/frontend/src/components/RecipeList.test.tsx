import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import RecipeList from './RecipeList';
import { renderWithProviders } from '../test/testUtils';
import type { Recipe } from '../types';

const mockRecipes: Record<string, Recipe> = {
  '1': {
    id: '1',
    title: 'Recipe One',
    ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'flour' }],
    steps: [{ orderIndex: 1, instruction: 'Mix' }],
  },
  '2': {
    id: '2',
    title: 'Recipe Two',
    ingredients: [{ orderIndex: 1, amount: 2, unit: 'cups', name: 'sugar' }],
    steps: [{ orderIndex: 1, instruction: 'Stir' }],
  },
};

describe('RecipeList', () => {
  it('renders all recipes', () => {
    renderWithProviders(<RecipeList />, {
      preloadedState: { recipes: { recipes: mockRecipes, recipesLoaded: true } },
    });
    expect(screen.getByText('Recipe One')).toBeInTheDocument();
    expect(screen.getByText('Recipe Two')).toBeInTheDocument();
  });

  it('renders empty state when no recipes', () => {
    renderWithProviders(<RecipeList />, {
      preloadedState: { recipes: { recipes: {}, recipesLoaded: true } },
    });
    expect(screen.getByText('No recipes found.')).toBeInTheDocument();
  });

  it('renders correct number of recipe cards', () => {
    renderWithProviders(<RecipeList />, {
      preloadedState: { recipes: { recipes: mockRecipes, recipesLoaded: true } },
    });
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
