import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { Providers, type Locale, type Theme } from './providers';

export const metadata: Metadata = {
  title: 'CogniLingua | Espanhol sob medida',
  description: 'Landing page e exercícios responsivos para praticar espanhol com feedback imediato.',
};

const SUPPORTED_LOCALES: Locale[] = ['pt', 'es', 'en'];
const FALLBACK_LOCALE: Locale = 'pt';

function normalizeLocale(locale: string | undefined): Locale {
  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  return FALLBACK_LOCALE;
}

function getPathLocale(pathname: string): Locale | null {
  const [, maybeLocale] = pathname.split('/');
  if (SUPPORTED_LOCALES.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return null;
}

async function resolveLocale(): Promise<Locale> {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? headerList.get('next-url') ?? '/';
  const pathLocale = getPathLocale(pathname);
  if (pathLocale) {
    return pathLocale;
  }

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;
  return normalizeLocale(localeCookie);
}

async function resolveTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  if (themeCookie === 'light' || themeCookie === 'dark') {
    return themeCookie;
  }
  return 'dark';
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await resolveLocale();
  const theme = await resolveTheme();

  return (
    <html lang={locale} data-theme={theme} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers locale={locale} fallbackLocale={FALLBACK_LOCALE} theme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
