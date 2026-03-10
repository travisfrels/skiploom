import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ShoppingList, ValidationError } from '../types';

interface ShoppingListState {
  lists: Record<string, ShoppingList>;
  listsLoaded: boolean;
  currentListId: string | null;
  loading: boolean;
  validationErrors: ValidationError[];
  submitting: boolean;
}

const initialState: ShoppingListState = {
  lists: {},
  listsLoaded: false,
  currentListId: null,
  loading: false,
  validationErrors: [],
  submitting: false,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = {};
      for (const list of action.payload) {
        state.lists[list.id] = list;
      }
    },
    setListsLoaded: (state, action: PayloadAction<boolean>) => {
      state.listsLoaded = action.payload;
    },
    setCurrentListId: (state, action: PayloadAction<string | null>) => {
      state.currentListId = action.payload;
    },
    clearCurrentListId: (state) => {
      state.currentListId = null;
    },
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists[action.payload.id] = action.payload;
    },
    updateList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists[action.payload.id] = action.payload;
    },
    removeList: (state, action: PayloadAction<string>) => {
      delete state.lists[action.payload];
      if (state.currentListId === action.payload) {
        state.currentListId = null;
      }
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = [];
    },
  },
});

export const {
  setLoading,
  setLists,
  setListsLoaded,
  setCurrentListId,
  clearCurrentListId,
  addList,
  updateList,
  removeList,
  setSubmitting,
  setValidationErrors,
  clearValidationErrors,
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
