import type { Metadata } from 'next';
import { DashboardContent } from './dashboard-content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Painel | CogniLingua',
    description: 'Visão geral com progresso, recomendação de lição e flashcards do dia.',
  };
}

export default async function DashboardPage() {
  return <DashboardContent />;
}
