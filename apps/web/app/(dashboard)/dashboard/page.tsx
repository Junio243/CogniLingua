import type { Metadata } from 'next';
import DashboardHome from './home-client';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Painel | CogniLingua',
    description:
      'Visão geral personalizada com exercícios, progresso recente e recomendações para acelerar seu espanhol.',
  };
}

export default function DashboardPage() {
  return <DashboardHome />;
}
