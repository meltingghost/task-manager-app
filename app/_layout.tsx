/**
 * Root layout: theme preference provider, auth guard, and stack navigator.
 * AuthGuard redirects unauthenticated users to login and authenticated users from login to tabs.
 */
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemePreferenceProvider } from '@/contexts/theme-preference-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    // Defer redirect until after the Stack navigator has mounted
    const timer = setTimeout(() => {
      const inLogin = segments[0] === 'login';
      if (!isAuthenticated && !inLogin) {
        router.replace('/login');
      } else if (isAuthenticated && inLogin) {
        router.replace('/(tabs)');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <AuthProvider>
        <AuthGuard>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </AuthGuard>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemePreferenceProvider>
  );
}
