import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadMealPlanEntryById } from './loadMealPlanEntryById';
import type { MealPlanEntry } from '../types';

vi.mock('../api', () => ({
  fetchMealPlanEntryById: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setMealPlanLoading: vi.fn(),
  setMealPlanError: vi.fn(),
  addMealPlanEntry: vi.fn(),
  setMealPlanEntriesLoaded: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testEntry: MealPlanEntry = {
  id: 'entry-123',
  date: '2026-03-05',
  mealType: 'DINNER',
  title: 'Spaghetti',
};

describe('loadMealPlanEntryById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading and clears error before fetching', async () => {
    vi.mocked(api.fetchMealPlanEntryById).mockResolvedValueOnce({ entry: testEntry, message: 'OK' });

    await loadMealPlanEntryById('entry-123');

    expect(act.setMealPlanLoading).toHaveBeenCalledWith(true);
    expect(act.setMealPlanError).toHaveBeenCalledWith(null);
  });

  it('adds entry on success', async () => {
    vi.mocked(api.fetchMealPlanEntryById).mockResolvedValueOnce({ entry: testEntry, message: 'OK' });

    await loadMealPlanEntryById('entry-123');

    expect(act.addMealPlanEntry).toHaveBeenCalledWith(testEntry);
    expect(act.setMealPlanEntriesLoaded).toHaveBeenCalledWith(true);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchMealPlanEntryById).mockRejectedValueOnce(new Error('Entry not found'));

    await loadMealPlanEntryById('entry-123');

    expect(act.setMealPlanError).toHaveBeenCalledWith('Entry not found');
    expect(act.addMealPlanEntry).not.toHaveBeenCalled();
  });

  it('sets loading to false in finally block', async () => {
    vi.mocked(api.fetchMealPlanEntryById).mockRejectedValueOnce(new Error('fail'));

    await loadMealPlanEntryById('entry-123');

    expect(act.setMealPlanLoading).toHaveBeenLastCalledWith(false);
  });
});
