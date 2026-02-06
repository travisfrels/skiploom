import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import RecipeDetail from './RecipeDetail';
import { renderWithProviders } from '../test/testUtils';
import { mockRecipes } from '../data/mockRecipes';

describe('RecipeDetail', () => {
  it('renders recipe title', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText("Grandma's Chocolate Chip Cookies")).toBeInTheDocument();
  });

  it('renders recipe description', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(
      screen.getByText(/The classic family recipe passed down for generations/)
    ).toBeInTheDocument();
  });

  it('renders ingredients section', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('all-purpose flour')).toBeInTheDocument();
  });

  it('renders instructions section', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText(/Preheat oven/)).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/1'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders not found for invalid recipe id', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/invalid-id'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText('Recipe Not Found')).toBeInTheDocument();
  });

  it('renders back link on not found page', () => {
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>,
      {
        initialEntries: ['/recipes/invalid-id'],
        preloadedState: { recipes: { recipes: mockRecipes } },
      }
    );
    expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
  });
});
