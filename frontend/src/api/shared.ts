import { ValidationFailedError, type ProblemDetailResponse } from '../types';

export const API_BASE_URL = 'http://localhost:8080/api';

export async function postCommand<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
}

export async function handleResponse<T>(response: Response): Promise<T> {
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
