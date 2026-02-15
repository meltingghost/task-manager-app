/**
 * useColorScheme for web: defers to client so static rendering is safe.
 * Uses theme preference context when available, otherwise system light/dark.
 */
import { useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemePreferenceContext } from '@/contexts/theme-preference-context';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 */
export function useColorScheme(): 'light' | 'dark' | null {
  const [hasHydrated, setHasHydrated] = useState(false);
  const ctx = useContext(ThemePreferenceContext);
  const system = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return 'light';
  }
  if (ctx && !ctx.isLoading) {
    return ctx.colorScheme;
  }
  return system === 'dark' || system === 'light' ? system : 'light';
}
