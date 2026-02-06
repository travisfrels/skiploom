import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IngredientList from './IngredientList';
import type { Ingredient } from '../types';

const mockIngredients: Ingredient[] = [
  { id: '1', amount: 2, unit: 'cups', name: 'flour' },
  { id: '2', amount: 1, unit: 'tsp', name: 'salt' },
  { id: '3', amount: 0.5, unit: 'cup', name: 'sugar' },
];

describe('IngredientList', () => {
  it('renders section title', () => {
    render(<IngredientList ingredients={mockIngredients} />);
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('renders all ingredients', () => {
    render(<IngredientList ingredients={mockIngredients} />);
    expect(screen.getByText('flour')).toBeInTheDocument();
    expect(screen.getByText('salt')).toBeInTheDocument();
    expect(screen.getByText('sugar')).toBeInTheDocument();
  });

  it('renders ingredient amounts and units', () => {
    render(<IngredientList ingredients={mockIngredients} />);
    expect(screen.getByText('2 cups')).toBeInTheDocument();
    expect(screen.getByText('1 tsp')).toBeInTheDocument();
    expect(screen.getByText('0.5 cup')).toBeInTheDocument();
  });

  it('renders empty list without errors', () => {
    render(<IngredientList ingredients={[]} />);
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });
});
