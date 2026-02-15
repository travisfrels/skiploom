import * as api from '../api';
import * as act from '../store/actions';

export async function loadUser(): Promise<void> {
  try {
    const user = await api.fetchMe();
    act.setUser(user);
  } catch (err) {
    act.setError(err instanceof Error ? err.message : 'Failed to load user');
  }
}
