import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'CogniLingua | Painel de aprendizagem',
    description:
      'Acesse o painel interativo do CogniLingua para acompanhar exercícios, módulos e progresso em espanhol.',
  };
}

export default function Home() {
  redirect('/dashboard');
}
