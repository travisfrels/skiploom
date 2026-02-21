import * as api from '../api';
import * as act from '../store/actions';

export async function loadFeatureFlags(): Promise<void> {
  act.setFeatureFlagLoading(true);
  act.setFeatureFlagError(null);

  try {
    const response = await api.fetchFeatureFlags();
    act.setFeatureFlags(response.featureFlags);
    act.setFeatureFlagsLoaded(true);
  } catch (err) {
    act.setFeatureFlagError(err instanceof Error ? err.message : 'Failed to load feature flags');
  } finally {
    act.setFeatureFlagLoading(false);
  }
}
