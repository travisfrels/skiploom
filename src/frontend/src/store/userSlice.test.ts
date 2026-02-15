import { describe, it, expect } from 'vitest';
import userReducer, { setUser } from './userSlice';
import type { User } from '../types';

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Test User',
};

describe('userSlice', () => {
  describe('initial state', () => {
    it('has null user', () => {
      const state = userReducer(undefined, { type: 'unknown' });
      expect(state.user).toBeNull();
    });
  });

  describe('setUser', () => {
    it('sets the user', () => {
      const state = userReducer({ user: null }, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
    });

    it('clears the user', () => {
      const state = userReducer({ user: mockUser }, setUser(null));
      expect(state.user).toBeNull();
    });
  });
});
