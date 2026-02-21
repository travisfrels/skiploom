import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FeatureFlagState {
  featureFlags: Record<string, boolean>;
  featureFlagsLoaded: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FeatureFlagState = {
  featureFlags: {},
  featureFlagsLoaded: false,
  loading: false,
  error: null,
};

const featureFlagSlice = createSlice({
  name: 'featureFlags',
  initialState,
  reducers: {
    setFeatureFlags: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.featureFlags = action.payload;
    },
    setFeatureFlagsLoaded: (state, action: PayloadAction<boolean>) => {
      state.featureFlagsLoaded = action.payload;
    },
    setFeatureFlagLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFeatureFlagError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFeatureFlags,
  setFeatureFlagsLoaded,
  setFeatureFlagLoading,
  setFeatureFlagError,
} = featureFlagSlice.actions;
export default featureFlagSlice.reducer;
