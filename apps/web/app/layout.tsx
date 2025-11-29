import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'CogniLingua | Espanhol sob medida',
  description: 'Landing page e exercícios responsivos para praticar espanhol com feedback imediato.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background font-sans text-slate-50">{children}</body>
    </html>
  );
}
