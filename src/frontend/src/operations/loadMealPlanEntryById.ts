import * as api from '../api';
import * as act from '../store/actions';

export async function loadMealPlanEntryById(id: string): Promise<void> {
  act.setMealPlanLoading(true);
  act.setNotificationError(null);

  try {
    const response = await api.fetchMealPlanEntryById({ id });
    act.addMealPlanEntry(response.entry);
    act.setMealPlanEntriesLoaded(true);
  } catch (err) {
    act.setNotificationError(err instanceof Error ? err.message : 'Failed to load meal plan entry');
  } finally {
    act.setMealPlanLoading(false);
  }
}
