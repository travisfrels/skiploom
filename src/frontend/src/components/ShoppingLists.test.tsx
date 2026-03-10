import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ShoppingLists from './ShoppingLists';
import { renderWithProviders } from '../test/testUtils';
import type { ShoppingList } from '../types';

const mockLists: Record<string, ShoppingList> = {
  '1': {
    id: '1',
    title: 'Grocery Run',
    items: [
      { id: 'a', label: 'Milk', checked: false, orderIndex: 1 },
    ],
  },
  '2': {
    id: '2',
    title: 'Party Supplies',
    items: [],
  },
};

describe('ShoppingLists', () => {
  it('renders page title', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists" element={<ShoppingLists />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists'],
        preloadedState: { shoppingList: { lists: mockLists, listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Shopping Lists')).toBeInTheDocument();
    });
  });

  it('renders shopping lists from store', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists" element={<ShoppingLists />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists'],
        preloadedState: { shoppingList: { lists: mockLists, listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Grocery Run')).toBeInTheDocument();
      expect(screen.getByText('Party Supplies')).toBeInTheDocument();
    });
  });

  it('renders empty state when no lists exist', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists" element={<ShoppingLists />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists'],
        preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('No shopping lists yet.')).toBeInTheDocument();
    });
  });

  it('renders new shopping list button', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists" element={<ShoppingLists />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists'],
        preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('New Shopping List')).toBeInTheDocument();
    });
  });

  it('renders loading state', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists" element={<ShoppingLists />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists'],
        preloadedState: { shoppingList: { lists: {}, listsLoaded: true, loading: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
