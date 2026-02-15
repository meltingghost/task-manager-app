/**
 * Auth state (isAuthenticated, isLoading) and signIn/signOut. Persists session with AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AUTH_STORAGE_KEY = '@task_manager_authenticated';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_STORAGE_KEY).then((value: string | null) => {
      setIsAuthenticated(value === 'true');
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(() => {
    setIsAuthenticated(true);
    AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true');
  }, []);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
