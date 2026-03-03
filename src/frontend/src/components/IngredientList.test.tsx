import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import IngredientList from './IngredientList';
import type { Ingredient } from '../types';

const mockIngredients: Ingredient[] = [
  { orderIndex: 1, amount: 2, unit: 'cups', name: 'flour' },
  { orderIndex: 2, amount: 1, unit: 'tsp', name: 'salt' },
  { orderIndex: 3, amount: 0.5, unit: 'cup', name: 'sugar' },
];

describe('IngredientList', () => {
  it('renders section title', () => {
    renderWithProviders(<IngredientList ingredients={mockIngredients} />);
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('renders all ingredients', () => {
    renderWithProviders(<IngredientList ingredients={mockIngredients} />);
    expect(screen.getByText('flour')).toBeInTheDocument();
    expect(screen.getByText('salt')).toBeInTheDocument();
    expect(screen.getByText('sugar')).toBeInTheDocument();
  });

  it('renders ingredient amounts and units', () => {
    renderWithProviders(<IngredientList ingredients={mockIngredients} />);
    expect(screen.getByText('2 cups')).toBeInTheDocument();
    expect(screen.getByText('1 tsp')).toBeInTheDocument();
    expect(screen.getByText('0.5 cup')).toBeInTheDocument();
  });

  it('renders empty list without errors', () => {
    renderWithProviders(<IngredientList ingredients={[]} />);
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  it('displays amounts as fractions when FRACTION_AMOUNTS flag is enabled', () => {
    renderWithProviders(<IngredientList ingredients={mockIngredients} />, {
      preloadedState: {
        featureFlags: { featureFlags: { FRACTION_AMOUNTS: true } },
      },
    });
    expect(screen.getByText('2 cups')).toBeInTheDocument();
    expect(screen.getByText('1 tsp')).toBeInTheDocument();
    expect(screen.getByText('1/2 cup')).toBeInTheDocument();
  });

  it('displays mixed numbers as fractions when flag is enabled', () => {
    const mixedIngredients: Ingredient[] = [
      { orderIndex: 1, amount: 1.75, unit: 'cups', name: 'flour' },
    ];
    renderWithProviders(<IngredientList ingredients={mixedIngredients} />, {
      preloadedState: {
        featureFlags: { featureFlags: { FRACTION_AMOUNTS: true } },
      },
    });
    expect(screen.getByText('1 3/4 cups')).toBeInTheDocument();
  });

  it('falls back to decimal for unsupported fractions when flag is enabled', () => {
    const unsupportedIngredients: Ingredient[] = [
      { orderIndex: 1, amount: 0.123, unit: 'cup', name: 'vanilla' },
    ];
    renderWithProviders(<IngredientList ingredients={unsupportedIngredients} />, {
      preloadedState: {
        featureFlags: { featureFlags: { FRACTION_AMOUNTS: true } },
      },
    });
    expect(screen.getByText('0.123 cup')).toBeInTheDocument();
  });

  it('displays amounts as decimals when FRACTION_AMOUNTS flag is disabled', () => {
    renderWithProviders(<IngredientList ingredients={mockIngredients} />, {
      preloadedState: {
        featureFlags: { featureFlags: { FRACTION_AMOUNTS: false } },
      },
    });
    expect(screen.getByText('2 cups')).toBeInTheDocument();
    expect(screen.getByText('1 tsp')).toBeInTheDocument();
    expect(screen.getByText('0.5 cup')).toBeInTheDocument();
  });

  it('applies dark mode classes', () => {
    renderWithProviders(<IngredientList ingredients={mockIngredients} />);
    const heading = screen.getByText('Ingredients');
    expect(heading.className).toContain('dark:text-slate-100');
    const amountUnit = screen.getByText('2 cups');
    expect(amountUnit.className).toContain('dark:text-slate-200');
    const name = screen.getByText('flour');
    expect(name.className).toContain('dark:text-slate-300');
  });
});
