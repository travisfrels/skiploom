import { useState, useEffect } from 'react';

export function useColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange(e: MediaQueryListEvent) {
      setScheme(e.matches ? 'dark' : 'light');
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return scheme;
}
