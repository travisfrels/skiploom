import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadFeatureFlags } from './loadFeatureFlags';

vi.mock('../api', () => ({
  fetchFeatureFlags: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setFeatureFlagLoading: vi.fn(),
  setFeatureFlagError: vi.fn(),
  setFeatureFlags: vi.fn(),
  setFeatureFlagsLoaded: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

describe('loadFeatureFlags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets loading and clears error before fetching', async () => {
    vi.mocked(api.fetchFeatureFlags).mockResolvedValueOnce({
      featureFlags: {},
      message: '0 feature flags found.',
    });

    await loadFeatureFlags();

    expect(act.setFeatureFlagLoading).toHaveBeenCalledWith(true);
    expect(act.setFeatureFlagError).toHaveBeenCalledWith(null);
  });

  it('sets feature flags and marks loaded on success', async () => {
    const flags = { EXAMPLE_FEATURE: true };
    vi.mocked(api.fetchFeatureFlags).mockResolvedValueOnce({
      featureFlags: flags,
      message: '1 feature flags found.',
    });

    await loadFeatureFlags();

    expect(act.setFeatureFlags).toHaveBeenCalledWith(flags);
    expect(act.setFeatureFlagsLoaded).toHaveBeenCalledWith(true);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchFeatureFlags).mockRejectedValueOnce(new Error('Network error'));

    await loadFeatureFlags();

    expect(act.setFeatureFlagError).toHaveBeenCalledWith('Network error');
    expect(act.setFeatureFlags).not.toHaveBeenCalled();
  });

  it('sets generic error for non-Error throws', async () => {
    vi.mocked(api.fetchFeatureFlags).mockRejectedValueOnce('unexpected');

    await loadFeatureFlags();

    expect(act.setFeatureFlagError).toHaveBeenCalledWith('Failed to load feature flags');
  });

  it('sets loading to false in finally block', async () => {
    vi.mocked(api.fetchFeatureFlags).mockRejectedValueOnce(new Error('fail'));

    await loadFeatureFlags();

    expect(act.setFeatureFlagLoading).toHaveBeenLastCalledWith(false);
  });
});
