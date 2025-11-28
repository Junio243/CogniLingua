import Link from 'next/link';
import type { ReactNode } from 'react';

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
          <div className="dashboard-shell">
            <aside className="dashboard-sidebar">
              <div className="sidebar-brand">
                <span className="brand-dot" />
                <div>
                  <strong>CogniLingua</strong>
                  <p>Dashboard</p>
                </div>
              </div>

              <nav className="sidebar-nav" aria-label="Navegação principal">
                {primaryNav.map((item) => (
                  <Link key={item.href} href={item.href} className="sidebar-link">
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="sidebar-section">
                <p className="sidebar-title">Atalhos de estudo</p>
                <div className="sidebar-cards">
                  {secondaryNav.map((item) => (
                    <Link key={item.href} href={item.href} className="sidebar-card">
                      <strong>{item.label}</strong>
                      {item.description ? <span>{item.description}</span> : null}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="sidebar-footnote">
                <p>Configure seus providers preferidos direto no layout.</p>
                <small>Slots prontos para tema, idioma e query client.</small>
              </div>
            </aside>

            <div className="dashboard-main">
              <header className="dashboard-topbar">
                <div>
                  <p className="muted">Ambiente personalizado</p>
                  <h1>Bem-vindo ao painel</h1>
                </div>
                <div className="topbar-actions">
                  <div className="provider-pills" aria-label="Providers ativos">
                    <span className="pill">🎨 Tema</span>
                    <span className="pill">🌎 Idioma</span>
                    <span className="pill">🔄 Query</span>
                  </div>
                  <Link href="/learning/modules" className="cta-link">
                    Acessar trilha
                  </Link>
                </div>
              </header>

              <main className="dashboard-content">{children}</main>
            </div>
          </div>
        </QueryClientProviderSlot>
      </LanguageProviderSlot>
    </ThemeProviderSlot>
  );
}
