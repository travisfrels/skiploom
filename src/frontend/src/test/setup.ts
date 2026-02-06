import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock fetch globally to prevent actual API calls in tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' }),
  } as Response)
);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
