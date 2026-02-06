import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import recipeReducer from '../store/recipeSlice';
import type { Recipe } from '../types';

interface RenderOptions {
  preloadedState?: {
    recipes: { recipes: Recipe[] };
  };
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    initialEntries = ['/'],
  }: RenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      recipes: recipeReducer,
    },
    preloadedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
