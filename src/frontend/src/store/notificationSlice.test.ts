import { describe, it, expect } from 'vitest';
import notificationReducer, { setError, setSuccess, clearNotifications } from './notificationSlice';

describe('notificationSlice', () => {
  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = notificationReducer(undefined, { type: 'unknown' });
      expect(state.error).toBeNull();
      expect(state.success).toBeNull();
    });
  });

  describe('setError', () => {
    it('sets the error message', () => {
      const state = notificationReducer(undefined, setError('Something went wrong'));
      expect(state.error).toBe('Something went wrong');
    });

    it('clears the error message', () => {
      const initialState = { error: 'Something went wrong', success: null };
      const state = notificationReducer(initialState, setError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('setSuccess', () => {
    it('sets the success message', () => {
      const state = notificationReducer(undefined, setSuccess('Operation completed'));
      expect(state.success).toBe('Operation completed');
    });

    it('clears the success message', () => {
      const initialState = { error: null, success: 'Operation completed' };
      const state = notificationReducer(initialState, setSuccess(null));
      expect(state.success).toBeNull();
    });
  });

  describe('clearNotifications', () => {
    it('clears both error and success', () => {
      const initialState = { error: 'An error', success: 'A success' };
      const state = notificationReducer(initialState, clearNotifications());
      expect(state.error).toBeNull();
      expect(state.success).toBeNull();
    });
  });
});
