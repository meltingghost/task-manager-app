/**
 * Returns the effective color scheme: user preference (light/dark/system) when inside
 * ThemePreferenceProvider, otherwise the system scheme.
 */
import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { ThemePreferenceContext } from '@/contexts/theme-preference-context';

export function useColorScheme(): 'light' | 'dark' | null {
  const ctx = useContext(ThemePreferenceContext);
  const system = useRNColorScheme();
  if (ctx && !ctx.isLoading) {
    return ctx.colorScheme;
  }
  return system === 'dark' || system === 'light' ? system : null;
}
