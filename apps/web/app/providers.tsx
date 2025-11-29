"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

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

type AuthContextValue = {
  user: null;
  signIn: () => void;
  signOut: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const I18nContext = createContext<I18nContextValue | undefined>(undefined);
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: null,
      signIn: () => undefined,
      signOut: () => undefined,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function Providers({
  children,
  locale,
  fallbackLocale,
  theme,
}: {
  children: ReactNode;
  locale: Locale;
  fallbackLocale: Locale;
  theme: Theme;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme={theme}>
        <I18nProvider locale={locale} fallbackLocale={fallbackLocale}>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export type { Theme, Locale, ThemeContextValue, I18nContextValue, AuthContextValue };
export { ThemeContext, I18nContext, AuthContext };
