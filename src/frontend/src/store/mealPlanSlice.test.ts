import { describe, it, expect } from 'vitest';
import mealPlanReducer, { setEntries, addEntry, updateEntry, removeEntry } from './mealPlanSlice';
import type { MealPlanEntry } from '../types';

const mockEntry: MealPlanEntry = {
  id: 'entry-1',
  date: '2026-03-05',
  mealType: 'DINNER',
  title: 'Spaghetti',
  notes: 'With garlic bread',
};

const initialState = {
  entries: {},
  entriesLoaded: false,
  loading: false,
  validationErrors: [],
  submitting: false,
};

describe('mealPlanSlice', () => {
  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = mealPlanReducer(undefined, { type: 'unknown' });
      expect(state.entries).toEqual({});
      expect(state.entriesLoaded).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.validationErrors).toEqual([]);
      expect(state.submitting).toBe(false);
    });
  });

  describe('setEntries', () => {
    it('converts array to map indexed by id', () => {
      const state = mealPlanReducer(initialState, setEntries([mockEntry]));
      expect(state.entries['entry-1']).toEqual(mockEntry);
    });
  });

  describe('addEntry', () => {
    it('adds entry to map', () => {
      const state = mealPlanReducer(initialState, addEntry(mockEntry));
      expect(state.entries['entry-1']).toEqual(mockEntry);
    });
  });

  describe('updateEntry', () => {
    it('updates existing entry in map', () => {
      const stateWithEntry = { ...initialState, entries: { 'entry-1': mockEntry } };
      const updated = { ...mockEntry, title: 'Updated Spaghetti' };
      const state = mealPlanReducer(stateWithEntry, updateEntry(updated));
      expect(state.entries['entry-1'].title).toBe('Updated Spaghetti');
    });
  });

  describe('removeEntry', () => {
    it('removes entry from map', () => {
      const stateWithEntry = { ...initialState, entries: { 'entry-1': mockEntry } };
      const state = mealPlanReducer(stateWithEntry, removeEntry('entry-1'));
      expect(state.entries['entry-1']).toBeUndefined();
    });
  });

});
