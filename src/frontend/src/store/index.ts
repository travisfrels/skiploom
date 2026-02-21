import { configureStore } from '@reduxjs/toolkit';
import featureFlagReducer from './featureFlagSlice';
import recipeReducer from './recipeSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    featureFlags: featureFlagReducer,
    recipes: recipeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
