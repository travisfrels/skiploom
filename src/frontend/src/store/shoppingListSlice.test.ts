import { describe, it, expect } from 'vitest';
import shoppingListReducer, {
  setLists,
  setListsLoaded,
  setCurrentListId,
  clearCurrentListId,
  addList,
  updateList,
  removeList,
  setSuccess,
} from './shoppingListSlice';
import type { ShoppingList } from '../types';

const mockList: ShoppingList = {
  id: 'list-1',
  title: 'Grocery Run',
  items: [
    { id: 'item-1', label: 'Milk', checked: false, orderIndex: 0 },
    { id: 'item-2', label: 'Bread', checked: true, orderIndex: 1 },
  ],
};

const initialState = {
  lists: {},
  listsLoaded: false,
  currentListId: null,
  loading: false,
  error: null,
  success: null,
  validationErrors: [],
  submitting: false,
};

describe('shoppingListSlice', () => {
  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = shoppingListReducer(undefined, { type: 'unknown' });
      expect(state.lists).toEqual({});
      expect(state.listsLoaded).toBe(false);
      expect(state.currentListId).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.success).toBeNull();
      expect(state.validationErrors).toEqual([]);
      expect(state.submitting).toBe(false);
    });
  });

  describe('setLists', () => {
    it('converts array to map indexed by id', () => {
      const state = shoppingListReducer(initialState, setLists([mockList]));
      expect(state.lists['list-1']).toEqual(mockList);
    });
  });

  describe('setListsLoaded', () => {
    it('sets the listsLoaded flag', () => {
      const state = shoppingListReducer(initialState, setListsLoaded(true));
      expect(state.listsLoaded).toBe(true);
    });
  });

  describe('setCurrentListId', () => {
    it('sets the current list id', () => {
      const state = shoppingListReducer(initialState, setCurrentListId('list-1'));
      expect(state.currentListId).toBe('list-1');
    });
  });

  describe('clearCurrentListId', () => {
    it('clears the current list id', () => {
      const stateWithCurrent = { ...initialState, currentListId: 'list-1' };
      const state = shoppingListReducer(stateWithCurrent, clearCurrentListId());
      expect(state.currentListId).toBeNull();
    });
  });

  describe('addList', () => {
    it('adds list to map', () => {
      const state = shoppingListReducer(initialState, addList(mockList));
      expect(state.lists['list-1']).toEqual(mockList);
    });
  });

  describe('updateList', () => {
    it('updates existing list in map', () => {
      const stateWithList = { ...initialState, lists: { 'list-1': mockList } };
      const updated = { ...mockList, title: 'Updated Grocery Run' };
      const state = shoppingListReducer(stateWithList, updateList(updated));
      expect(state.lists['list-1'].title).toBe('Updated Grocery Run');
    });
  });

  describe('removeList', () => {
    it('removes list from map', () => {
      const stateWithList = { ...initialState, lists: { 'list-1': mockList } };
      const state = shoppingListReducer(stateWithList, removeList('list-1'));
      expect(state.lists['list-1']).toBeUndefined();
    });

    it('clears currentListId when removing the current list', () => {
      const stateWithCurrent = {
        ...initialState,
        lists: { 'list-1': mockList },
        currentListId: 'list-1',
      };
      const state = shoppingListReducer(stateWithCurrent, removeList('list-1'));
      expect(state.currentListId).toBeNull();
    });

    it('preserves currentListId when removing a different list', () => {
      const otherList: ShoppingList = { id: 'list-2', title: 'Other', items: [] };
      const stateWithBoth = {
        ...initialState,
        lists: { 'list-1': mockList, 'list-2': otherList },
        currentListId: 'list-1',
      };
      const state = shoppingListReducer(stateWithBoth, removeList('list-2'));
      expect(state.currentListId).toBe('list-1');
    });
  });

  describe('setSuccess', () => {
    it('sets the success message', () => {
      const state = shoppingListReducer(initialState, setSuccess('List created'));
      expect(state.success).toBe('List created');
    });

    it('clears the success message', () => {
      const stateWithSuccess = { ...initialState, success: 'List created' };
      const state = shoppingListReducer(stateWithSuccess, setSuccess(null));
      expect(state.success).toBeNull();
    });
  });
});
