import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ShoppingListCard from './ShoppingListCard';
import { renderWithProviders } from '../test/testUtils';
import type { ShoppingList } from '../types';

const listWithItems: ShoppingList = {
  id: '1',
  title: 'Grocery Run',
  items: [
    { id: 'a', label: 'Milk', checked: false, orderIndex: 1 },
    { id: 'b', label: 'Eggs', checked: true, orderIndex: 2 },
    { id: 'c', label: 'Bread', checked: false, orderIndex: 3 },
  ],
};

const emptyList: ShoppingList = {
  id: '2',
  title: 'Empty List',
  items: [],
};

describe('ShoppingListCard', () => {
  it('renders list title', () => {
    renderWithProviders(<ShoppingListCard list={listWithItems} />);
    expect(screen.getByText('Grocery Run')).toBeInTheDocument();
  });

  it('renders item count', () => {
    renderWithProviders(<ShoppingListCard list={listWithItems} />);
    expect(screen.getByText('3 items')).toBeInTheDocument();
  });

  it('renders checked count when items are checked', () => {
    renderWithProviders(<ShoppingListCard list={listWithItems} />);
    expect(screen.getByText('1 checked')).toBeInTheDocument();
  });

  it('does not render checked count when no items are checked', () => {
    const uncheckedList: ShoppingList = {
      ...listWithItems,
      items: listWithItems.items.map((i) => ({ ...i, checked: false })),
    };
    renderWithProviders(<ShoppingListCard list={uncheckedList} />);
    expect(screen.queryByText(/checked/)).not.toBeInTheDocument();
  });

  it('renders singular item text for one item', () => {
    const singleItemList: ShoppingList = {
      id: '3',
      title: 'Single',
      items: [{ id: 'a', label: 'Milk', checked: false, orderIndex: 1 }],
    };
    renderWithProviders(<ShoppingListCard list={singleItemList} />);
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('renders zero items for empty list', () => {
    renderWithProviders(<ShoppingListCard list={emptyList} />);
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('links to detail page', () => {
    renderWithProviders(<ShoppingListCard list={listWithItems} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/shopping-lists/1');
  });
});
