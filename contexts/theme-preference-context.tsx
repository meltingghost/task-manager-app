/**
 * Theme preference (light / dark / system) with AsyncStorage persistence.
 * Exposes resolved colorScheme for ThemeProvider and setPreference for the menu toggle.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@task_manager_theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemePreferenceContextValue {
  colorScheme: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  isLoading: boolean;
}

export const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((value: string | null) => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setPreferenceState(value);
      }
      setIsLoading(false);
    });
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(THEME_STORAGE_KEY, p);
  }, []);

  const colorScheme: 'light' | 'dark' = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const value = useMemo<ThemePreferenceContextValue>(
    () => ({ colorScheme, preference, setPreference, isLoading }),
    [colorScheme, preference, setPreference, isLoading]
  );

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemePreferenceContext.Provider value={value}>
      <ThemeProvider value={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  return ctx;
}
