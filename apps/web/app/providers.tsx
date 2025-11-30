"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { HttpClientOptions } from '../services/httpClient';
import type { AuthSession } from '../services/authApi';
import { authApi } from '../services/authApi';

type Theme = 'light' | 'dark';
type Locale = 'pt' | 'es' | 'en';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

type I18nContextValue = {
  locale: Locale;
  fallbackLocale: Locale;
  t: (key: string) => string;
};

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
type AuthContextValue = {
  session: AuthSession | null;
  status: AuthStatus;
  error?: string;
  refresh: () => Promise<void>;
  signOut: () => void;
};

type HttpClientContextValue = {
  applyAuth: (options?: HttpClientOptions) => HttpClientOptions;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const I18nContext = createContext<I18nContextValue | undefined>(undefined);
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const HttpClientContext = createContext<HttpClientContextValue | undefined>(undefined);

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function persistPreference(key: string, value: string) {
  document.cookie = `${key}=${value}; path=/; max-age=${ONE_YEAR_IN_SECONDS}`;
}

function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    root.classList.toggle('dark', theme === 'dark');
    persistPreference('theme', theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function I18nProvider({
  children,
  locale,
  fallbackLocale,
}: {
  children: ReactNode;
  locale: Locale;
  fallbackLocale: Locale;
}) {
  const normalizedLocale = locale ?? fallbackLocale;

  useEffect(() => {
    persistPreference('locale', normalizedLocale);
  }, [normalizedLocale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: normalizedLocale,
      fallbackLocale,
      t: (key: string) => key,
    }),
    [fallbackLocale, normalizedLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function AuthProvider({ children, initialSession }: { children: ReactNode; initialSession: AuthSession | null }) {
  const [session, setSession] = useState<AuthSession | null>(initialSession);
  const [status, setStatus] = useState<AuthStatus>(initialSession ? 'authenticated' : 'loading');
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(undefined);
    const nextSession = await authApi.fetchActiveSession();
    if (!nextSession) {
      setSession(null);
      setStatus('unauthenticated');
      setError('Sessão expirada. Faça login novamente.');
      return;
    }
    setSession(nextSession);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(() => {
    document.cookie = 'auth_token=; Max-Age=0; path=/';
    document.cookie = 'student_id=; Max-Age=0; path=/';
    setSession(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    if (!initialSession) {
      refresh();
    }
  }, [initialSession, refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      status,
      error,
      refresh,
      signOut,
    }),
    [session, status, error, refresh, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function HttpClientProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const applyAuth = useCallback(
    (options: HttpClientOptions = {}) => ({
      withCredentials: true,
      authToken: auth?.session?.token,
      ...options,
    }),
    [auth?.session?.token],
  );

  const value = useMemo<HttpClientContextValue>(() => ({ applyAuth }), [applyAuth]);

  return <HttpClientContext.Provider value={value}>{children}</HttpClientContext.Provider>;
}

export function Providers({
  children,
  locale,
  fallbackLocale,
  theme,
  initialSession,
}: {
  children: ReactNode;
  locale: Locale;
  fallbackLocale: Locale;
  theme: Theme;
  initialSession: AuthSession | null;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme={theme}>
        <I18nProvider locale={locale} fallbackLocale={fallbackLocale}>
          <AuthProvider initialSession={initialSession}>
            <HttpClientProvider>{children}</HttpClientProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export type { Theme, Locale, ThemeContextValue, I18nContextValue, AuthContextValue, AuthStatus };
export { ThemeContext, I18nContext, AuthContext, HttpClientContext };

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}

export function useHttpClient(): HttpClientContextValue {
  const ctx = useContext(HttpClientContext);
  if (!ctx) {
    throw new Error('useHttpClient deve ser usado dentro de <HttpClientProvider>');
  }
  return ctx;
}
