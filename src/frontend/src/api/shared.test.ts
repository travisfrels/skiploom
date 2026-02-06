import { describe, it, expect, vi } from 'vitest';
import { handleResponse, postCommand } from './shared';
import { ValidationFailedError } from '../types';

function mockResponse(status: number, body: unknown, ok?: boolean): Response {
  return {
    ok: ok ?? (status >= 200 && status < 300),
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

function mockNonJsonResponse(status: number): Response {
  return {
    ok: false,
    status,
    json: () => Promise.reject(new SyntaxError('Unexpected token')),
  } as Response;
}

describe('handleResponse', () => {
  it('returns parsed JSON for successful responses', async () => {
    const data = { recipe: { id: '1', title: 'Test' } };
    const result = await handleResponse(mockResponse(200, data));
    expect(result).toEqual(data);
  });

  it('throws ValidationFailedError for 400 with field errors', async () => {
    const body = {
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Validation failed',
      instance: '/api/commands/create_recipe',
      errors: [
        { field: 'title', message: 'Title is required' },
      ],
    };

    await expect(handleResponse(mockResponse(400, body))).rejects.toThrow(ValidationFailedError);

    try {
      await handleResponse(mockResponse(400, body));
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationFailedError);
      expect((err as ValidationFailedError).message).toBe('Validation failed');
      expect((err as ValidationFailedError).errors).toEqual([
        { field: 'title', message: 'Title is required' },
      ]);
    }
  });

  it('throws Error with detail for 400 without field errors', async () => {
    const body = {
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid recipe id: not-a-uuid',
      instance: '/api/commands/update_recipe',
    };

    await expect(handleResponse(mockResponse(400, body))).rejects.toThrow(Error);
    await expect(handleResponse(mockResponse(400, body))).rejects.not.toThrow(ValidationFailedError);
    await expect(handleResponse(mockResponse(400, body))).rejects.toThrow('Invalid recipe id: not-a-uuid');
  });

  it('throws Error with detail for 404', async () => {
    const body = {
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      detail: 'Recipe not found: abc-123',
      instance: '/api/queries/fetch_recipe_by_id/abc-123',
    };

    await expect(handleResponse(mockResponse(404, body))).rejects.toThrow('Recipe not found: abc-123');
  });

  it('throws Error with detail for 500', async () => {
    const body = {
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'An unexpected error occurred',
      instance: '/api/commands/create_recipe',
    };

    await expect(handleResponse(mockResponse(500, body))).rejects.toThrow('An unexpected error occurred');
  });

  it('throws Error with status for non-JSON error responses', async () => {
    await expect(handleResponse(mockNonJsonResponse(502))).rejects.toThrow('Request failed with status 502');
  });

  it('throws Error with status when detail is empty', async () => {
    const body = {
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: '',
      instance: '/api/commands/create_recipe',
    };

    await expect(handleResponse(mockResponse(500, body))).rejects.toThrow('Request failed with status 500');
  });
});

describe('postCommand', () => {
  it('sends POST with JSON content-type and stringified body', async () => {
    const responseData = { id: '1' };
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(200, responseData));

    const result = await postCommand('/commands/test', { name: 'test' });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/commands/test',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test' }),
      }
    );
    expect(result).toEqual(responseData);
  });

  it('delegates error handling to handleResponse', async () => {
    const errorBody = {
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid input',
      instance: '/api/commands/test',
    };
    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse(400, errorBody));

    await expect(postCommand('/commands/test', {})).rejects.toThrow('Invalid input');
  });
});
