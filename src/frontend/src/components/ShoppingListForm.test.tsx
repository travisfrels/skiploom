import { describe, it, expect } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ShoppingListForm from './ShoppingListForm';
import { renderWithProviders } from '../test/testUtils';
import * as shoppingListSlice from '../store/shoppingListSlice';
import type { ShoppingList } from '../types';

const testList: ShoppingList = {
  id: '1',
  title: 'Grocery Run',
  items: [
    { id: 'a', label: 'Milk', checked: false, orderIndex: 1 },
    { id: 'b', label: 'Eggs', checked: true, orderIndex: 2 },
  ],
};

describe('ShoppingListForm', () => {
  describe('new mode', () => {
    it('renders new shopping list heading', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/new" element={<ShoppingListForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/new'],
          preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('New Shopping List')).toBeInTheDocument();
      });
    });

    it('renders title input', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/new" element={<ShoppingListForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/new'],
          preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Shopping list title')).toBeInTheDocument();
      });
    });

    it('renders create button', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/new" element={<ShoppingListForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/new'],
          preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Create Shopping List')).toBeInTheDocument();
      });
    });

    it('renders cancel link', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/new" element={<ShoppingListForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/new'],
          preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    it('does not render items section in new mode', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/new" element={<ShoppingListForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/new'],
          preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.queryByText('Items')).not.toBeInTheDocument();
      });
    });

    it('renders validation error for title', async () => {
      const { store } = renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/new" element={<ShoppingListForm mode="new" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/new'],
          preloadedState: { shoppingList: { lists: {}, listsLoaded: true } },
        }
      );

      act(() => {
        store.dispatch(shoppingListSlice.setValidationErrors([
          { field: 'title', message: 'Title is required' },
        ]));
      });

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
    });
  });

  describe('edit mode', () => {
    it('renders edit shopping list heading', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/1/edit'],
          preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Edit Shopping List')).toBeInTheDocument();
      });
    });

    it('renders save changes button in edit mode', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/1/edit'],
          preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Save Changes')).toBeInTheDocument();
      });
    });

    it('renders items section in edit mode', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/1/edit'],
          preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Items')).toBeInTheDocument();
        expect(screen.getByText('+ Add Item')).toBeInTheDocument();
      });
    });

    it('populates form with existing list data', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/1/edit'],
          preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
        }
      );
      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Shopping list title') as HTMLInputElement;
        expect(titleInput.value).toBe('Grocery Run');
      });
    });

    it('renders not found for invalid list in edit mode', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/invalid/edit'],
          preloadedState: { shoppingList: { lists: {}, currentListId: 'invalid', listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Shopping list not found.')).toBeInTheDocument();
      });
    });

    it('renders back link', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Routes>,
        {
          initialEntries: ['/shopping-lists/1/edit'],
          preloadedState: { shoppingList: { lists: { '1': testList }, currentListId: '1', listsLoaded: true } },
        }
      );
      await waitFor(() => {
        expect(screen.getByText('Back to Shopping Lists')).toBeInTheDocument();
      });
    });
  });
});
