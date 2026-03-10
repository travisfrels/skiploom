import { configureStore } from '@reduxjs/toolkit';
import featureFlagReducer from './featureFlagSlice';
import mealPlanReducer from './mealPlanSlice';
import notificationReducer from './notificationSlice';
import recipeReducer from './recipeSlice';
import shoppingListReducer from './shoppingListSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    featureFlags: featureFlagReducer,
    mealPlan: mealPlanReducer,
    notification: notificationReducer,
    recipes: recipeReducer,
    shoppingList: shoppingListReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
