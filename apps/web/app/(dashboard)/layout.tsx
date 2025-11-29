import Link from 'next/link';
import type { ReactNode } from 'react';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

type DashboardLayoutProps = {
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

const primaryNav: NavItem[] = [
  { href: '/dashboard', label: 'Visão geral' },
  { href: '/learning/modules', label: 'Módulos' },
  { href: '/learning/lessons/aquecimento', label: 'Lições' },
  { href: '/learning/flashcards', label: 'Flashcards' },
  { href: '/analytics', label: 'Analytics' },
];

const secondaryNav: NavItem[] = [
  {
    href: '/learning/modules/basico-1',
    label: 'Fluxo recomendado',
    description: 'Continue de onde parou com seu módulo atual.',
  },
  {
    href: '/learning/lessons/revisao',
    label: 'Revisão rápida',
    description: 'Recupere vocabulário e padrões antes do próximo teste.',
  },
];

function ThemeProviderSlot({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function LanguageProviderSlot({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function QueryClientProviderSlot({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProviderSlot>
      <LanguageProviderSlot>
        <QueryClientProviderSlot>
          <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-12 pt-10 lg:px-8">
            <aside className="hidden w-72 flex-shrink-0 flex-col gap-4 lg:flex">
              <Link href="/dashboard" className="glass-panel flex items-center gap-3 px-4 py-3 shadow-glow">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-lg font-bold text-primary-200">
                  CL
                </div>
                <div>
                  <p className="text-xs uppercase text-primary-200">CogniLingua</p>
                  <p className="text-base font-semibold text-slate-50">Painel ativo</p>
                </div>
              </Link>

              <nav className="glass-panel space-y-2 p-3" aria-label="Navegação principal">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden className="text-xs text-slate-500">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="glass-panel space-y-3 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Atalhos de estudo</p>
                <div className="space-y-2">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      className="block rounded-xl border border-white/5 bg-slate-900/40 p-3 transition hover:border-primary-400/30 hover:bg-slate-900/70"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-slate-100">{item.label}</strong>
                        <Badge variant="neutral">Ir agora</Badge>
                      </div>
                      {item.description ? <p className="mt-1 text-sm text-slate-400">{item.description}</p> : null}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="glass-panel space-y-2 p-4">
                <p className="text-sm font-semibold text-slate-100">Providers e contexto</p>
                <p className="text-sm text-slate-400">Slots prontos para tema, idioma e query client.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Tema</Badge>
                  <Badge variant="neutral">Idioma</Badge>
                  <Badge variant="outline">Query</Badge>
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <header className="glass-panel flex flex-col gap-3 rounded-2xl border border-primary-400/10 px-5 py-4 shadow-glow md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary-200">Ambiente personalizado</p>
                  <h1 className="text-2xl font-semibold text-slate-50">Bem-vindo ao painel</h1>
                  <p className="text-sm text-slate-400">Progresso, lições e recomendações dinâmicas em um só lugar.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/learning/modules">Acessar trilha</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/learning/flashcards">Revisão rápida</Link>
                  </Button>
                </div>
              </header>

              <main className="space-y-6">{children}</main>
            </div>
          </div>
        </QueryClientProviderSlot>
      </LanguageProviderSlot>
    </ThemeProviderSlot>
  );
}
