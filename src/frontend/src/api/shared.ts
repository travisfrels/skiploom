import { ValidationFailedError, type ProblemDetailResponse } from '../types';

export const API_BASE_URL = '/api';

function getCsrfToken(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export async function postCommand<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    window.location.href = '/oauth2/authorization/google';
    return new Promise<T>(() => {});
  }

  if (response.ok) return await response.json();

  let body: ProblemDetailResponse;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 400 && body.errors?.length) {
    throw new ValidationFailedError(body);
  }

  throw new Error(body.detail || `Request failed with status ${response.status}`);
}
