import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeList from './RecipeList';
import type { Recipe } from '../types';

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Recipe One',
    ingredients: [{ id: '1', amount: 1, unit: 'cup', name: 'flour' }],
    steps: [{ id: 's1', orderIndex: 1, instruction: 'Mix' }],
  },
  {
    id: '2',
    title: 'Recipe Two',
    ingredients: [{ id: '2', amount: 2, unit: 'tbsp', name: 'sugar' }],
    steps: [{ id: 's2', orderIndex: 1, instruction: 'Bake' }],
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
