import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import type { Recipe } from '../types';

const mockRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  ingredients: [
    { id: '1', amount: 1, unit: 'cup', name: 'flour' },
    { id: '2', amount: 2, unit: 'tbsp', name: 'sugar' },
  ],
  steps: [
    { id: 's1', orderIndex: 1, instruction: 'Mix ingredients' },
    { id: 's2', orderIndex: 2, instruction: 'Bake at 350F' },
  ],
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('RecipeCard', () => {
  it('renders recipe title', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  it('renders recipe description', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
  });

  it('renders ingredient count', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('2 ingredients')).toBeInTheDocument();
  });

  it('renders step count', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('2 steps')).toBeInTheDocument();
  });

  it('links to recipe detail page', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/recipes/1');
  });

  it('handles recipe without description', () => {
    const recipeNoDesc = { ...mockRecipe, description: undefined };
    renderWithRouter(<RecipeCard recipe={recipeNoDesc} />);
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.queryByText('A delicious test recipe')).not.toBeInTheDocument();
  });
});
