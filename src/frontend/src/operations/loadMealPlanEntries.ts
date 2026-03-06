import type { FetchMealPlanEntriesQuery } from '../types';
import * as api from '../api';
import * as act from '../store/actions';

export async function loadMealPlanEntries(query: FetchMealPlanEntriesQuery): Promise<void> {
  act.setMealPlanLoading(true);
  act.setMealPlanError(null);

  try {
    const response = await api.fetchMealPlanEntries(query);
    act.setMealPlanEntries(response.entries);
    act.setMealPlanEntriesLoaded(true);
  } catch (err) {
    act.setMealPlanError(err instanceof Error ? err.message : 'Failed to load meal plan entries');
  } finally {
    act.setMealPlanLoading(false);
  }
}
