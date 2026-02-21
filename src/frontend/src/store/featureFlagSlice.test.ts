import { describe, it, expect } from 'vitest';
import featureFlagReducer, {
  setFeatureFlags,
  setFeatureFlagsLoaded,
  setFeatureFlagLoading,
  setFeatureFlagError,
} from './featureFlagSlice';

describe('featureFlagSlice', () => {
  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = featureFlagReducer(undefined, { type: 'unknown' });
      expect(state.featureFlags).toEqual({});
      expect(state.featureFlagsLoaded).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setFeatureFlags', () => {
    it('sets the feature flags', () => {
      const state = featureFlagReducer(
        { featureFlags: {}, featureFlagsLoaded: false, loading: false, error: null },
        setFeatureFlags({ EXAMPLE_FEATURE: true })
      );
      expect(state.featureFlags).toEqual({ EXAMPLE_FEATURE: true });
    });
  });

  describe('setFeatureFlagsLoaded', () => {
    it('sets the loaded flag', () => {
      const state = featureFlagReducer(
        { featureFlags: {}, featureFlagsLoaded: false, loading: false, error: null },
        setFeatureFlagsLoaded(true)
      );
      expect(state.featureFlagsLoaded).toBe(true);
    });
  });

  describe('setFeatureFlagLoading', () => {
    it('sets the loading flag', () => {
      const state = featureFlagReducer(
        { featureFlags: {}, featureFlagsLoaded: false, loading: false, error: null },
        setFeatureFlagLoading(true)
      );
      expect(state.loading).toBe(true);
    });
  });

  describe('setFeatureFlagError', () => {
    it('sets the error message', () => {
      const state = featureFlagReducer(
        { featureFlags: {}, featureFlagsLoaded: false, loading: false, error: null },
        setFeatureFlagError('Failed to load')
      );
      expect(state.error).toBe('Failed to load');
    });

    it('clears the error message', () => {
      const state = featureFlagReducer(
        { featureFlags: {}, featureFlagsLoaded: false, loading: false, error: 'Failed to load' },
        setFeatureFlagError(null)
      );
      expect(state.error).toBeNull();
    });
  });
});
