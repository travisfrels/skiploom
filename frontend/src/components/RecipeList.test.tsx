import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeList from './RecipeList';
import type { RecipeSummary } from '../types';

const mockRecipes: RecipeSummary[] = [
  {
    id: '1',
    title: 'Recipe One',
    ingredientCount: 1,
    stepCount: 1,
  },
  {
    id: '2',
    title: 'Recipe Two',
    ingredientCount: 1,
    stepCount: 1,
  },
];

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('RecipeList', () => {
  it('renders all recipes', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} />);
    expect(screen.getByText('Recipe One')).toBeInTheDocument();
    expect(screen.getByText('Recipe Two')).toBeInTheDocument();
  });

  it('renders empty state when no recipes', () => {
    renderWithRouter(<RecipeList recipes={[]} />);
    expect(screen.getByText('No recipes found.')).toBeInTheDocument();
  });

  it('renders correct number of recipe cards', () => {
    renderWithRouter(<RecipeList recipes={mockRecipes} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
