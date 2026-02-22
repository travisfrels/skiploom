import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColorScheme } from './useColorScheme';

type ChangeHandler = (e: MediaQueryListEvent) => void;

function createMockMatchMedia(matches: boolean) {
  const listeners: ChangeHandler[] = [];
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn((event: string, handler: ChangeHandler) => {
      if (event === 'change') listeners.push(handler);
    }),
    removeEventListener: vi.fn((event: string, handler: ChangeHandler) => {
      if (event === 'change') {
        const idx = listeners.indexOf(handler);
        if (idx >= 0) listeners.splice(idx, 1);
      }
    }),
  };
  return { mql, listeners };
}

describe('useColorScheme', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns "dark" when OS prefers dark color scheme', () => {
    const { mql } = createMockMatchMedia(true);
    window.matchMedia = vi.fn().mockReturnValue(mql);

    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('dark');
  });

  it('returns "light" when OS prefers light color scheme', () => {
    const { mql } = createMockMatchMedia(false);
    window.matchMedia = vi.fn().mockReturnValue(mql);

    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  it('updates when OS color scheme preference changes', () => {
    const { mql, listeners } = createMockMatchMedia(false);
    window.matchMedia = vi.fn().mockReturnValue(mql);

    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');

    act(() => {
      listeners.forEach((fn) =>
        fn({ matches: true } as MediaQueryListEvent),
      );
    });
    expect(result.current).toBe('dark');
  });

  it('cleans up event listener on unmount', () => {
    const { mql } = createMockMatchMedia(false);
    window.matchMedia = vi.fn().mockReturnValue(mql);

    const { unmount } = renderHook(() => useColorScheme());
    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});
