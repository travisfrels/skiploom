import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MealPlanEntry, ValidationError } from '../types';

interface MealPlanState {
  entries: Record<string, MealPlanEntry>;
  entriesLoaded: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  validationErrors: ValidationError[];
  submitting: boolean;
}

const initialState: MealPlanState = {
  entries: {},
  entriesLoaded: false,
  loading: false,
  error: null,
  success: null,
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
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
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
  setError,
  setSuccess,
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
