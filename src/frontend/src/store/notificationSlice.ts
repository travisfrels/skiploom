import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  error: string | null;
  success: string | null;
}

const initialState: NotificationState = {
  error: null,
  success: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearNotifications: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const { setError, setSuccess, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
