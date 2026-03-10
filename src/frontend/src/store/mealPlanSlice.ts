import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MealPlanEntry, ValidationError } from '../types';

interface MealPlanState {
  entries: Record<string, MealPlanEntry>;
  entriesLoaded: boolean;
  loading: boolean;
  validationErrors: ValidationError[];
  submitting: boolean;
}

const initialState: MealPlanState = {
  entries: {},
  entriesLoaded: false,
  loading: false,
  validationErrors: [],
  submitting: false,
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEntries: (state, action: PayloadAction<MealPlanEntry[]>) => {
      state.entries = {};
      for (const entry of action.payload) {
        state.entries[entry.id] = entry;
      }
    },
    setEntriesLoaded: (state, action: PayloadAction<boolean>) => {
      state.entriesLoaded = action.payload;
    },
    addEntry: (state, action: PayloadAction<MealPlanEntry>) => {
      state.entries[action.payload.id] = action.payload;
    },
    updateEntry: (state, action: PayloadAction<MealPlanEntry>) => {
      state.entries[action.payload.id] = action.payload;
    },
    removeEntry: (state, action: PayloadAction<string>) => {
      delete state.entries[action.payload];
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
  setEntries,
  setEntriesLoaded,
  addEntry,
  updateEntry,
  removeEntry,
  setSubmitting,
  setValidationErrors,
  clearValidationErrors,
} = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
