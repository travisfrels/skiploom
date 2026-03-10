import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ShoppingListDetail from './ShoppingListDetail';
import { renderWithProviders } from '../test/testUtils';
import type { ShoppingList } from '../types';

const testList: ShoppingList = {
  id: '1',
  title: 'Grocery Run',
  items: [
    { id: 'a', label: 'Milk', checked: false, orderIndex: 1 },
    { id: 'b', label: 'Eggs', checked: true, orderIndex: 2 },
  ],
};

const emptyItemsList: ShoppingList = {
  id: '2',
  title: 'Empty List',
  items: [],
};

describe('ShoppingListDetail', () => {
  it('renders list title', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/1'],
        preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Grocery Run')).toBeInTheDocument();
    });
  });

  it('renders items with checkboxes', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/1'],
        preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Eggs')).toBeInTheDocument();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  it('renders edit and delete buttons', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/1'],
        preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('renders add item input', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/1'],
        preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add new item...')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });

  it('renders empty items state', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/2'],
        preloadedState: { shoppingList: { lists: { '2': emptyItemsList }, currentListId: '2', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('No items yet. Add your first item below.')).toBeInTheDocument();
    });
  });

  it('renders not found for invalid list id', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/invalid-id'],
        preloadedState: { shoppingList: { lists: {}, currentListId: 'invalid-id', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Shopping List Not Found')).toBeInTheDocument();
    });
  });

  it('renders back link on not found page', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/invalid-id'],
        preloadedState: { shoppingList: { lists: {}, currentListId: 'invalid-id', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      expect(screen.getByText('Back to Shopping Lists')).toBeInTheDocument();
    });
  });

  it('applies dark mode classes to not found state', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/invalid-id'],
        preloadedState: { shoppingList: { lists: {}, currentListId: 'invalid-id', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      const heading = screen.getByText('Shopping List Not Found');
      expect(heading.className).toContain('dark:text-slate-100');
      const message = screen.getByText("The shopping list you're looking for doesn't exist.");
      expect(message.className).toContain('dark:text-slate-300');
    });
  });

  it('applies dark mode classes to list detail', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>,
      {
        initialEntries: ['/shopping-lists/1'],
        preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
      }
    );
    await waitFor(() => {
      const title = screen.getByText('Grocery Run');
      expect(title.className).toContain('dark:text-slate-100');
    });
  });
});
