import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadUser } from './loadUser';

vi.mock('../api', () => ({
  fetchMe: vi.fn(),
}));

vi.mock('../store/actions', () => ({
  setUser: vi.fn(),
  setError: vi.fn(),
}));

import * as api from '../api';
import * as act from '../store/actions';

const testUser = {
  id: 'user-1',
  email: 'test@example.com',
  displayName: 'Test User',
};

describe('loadUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets user on success', async () => {
    vi.mocked(api.fetchMe).mockResolvedValueOnce(testUser);

    await loadUser();

    expect(act.setUser).toHaveBeenCalledWith(testUser);
  });

  it('sets error on failure', async () => {
    vi.mocked(api.fetchMe).mockRejectedValueOnce(new Error('Network error'));

    await loadUser();

    expect(act.setError).toHaveBeenCalledWith('Network error');
    expect(act.setUser).not.toHaveBeenCalled();
  });

  it('sets generic error for non-Error throws', async () => {
    vi.mocked(api.fetchMe).mockRejectedValueOnce('unexpected');

    await loadUser();

    expect(act.setError).toHaveBeenCalledWith('Failed to load user');
  });
});
