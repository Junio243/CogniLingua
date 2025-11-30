import type { Metadata } from 'next';

import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { getSpanishFlashcards } from '../../../../services/learningApi';
import type { Flashcard } from '../../../../types/learning';
import { getFallbackCards } from '../lessons/data';
import { FlashcardReview } from './flashcard-review';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Flashcards | CogniLingua',
    description: 'Spaced repetition com botões Fácil/Médio/Difícil e animações leves.',
  };
}

async function fetchDailyCards(): Promise<Flashcard[]> {
  try {
    const { cards } = await getSpanishFlashcards(
      { studentId: 'demo-student', conceptId: 'basico-1', limit: 8 },
      { mode: 'csr' }
    );

    return cards?.length ? cards : getFallbackCards();
  } catch (error) {
    console.error('[flashcards] fallback cards used:', error);
    return getFallbackCards();
  }
}

export default async function FlashcardsPage() {
  const cards = await fetchDailyCards();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-primary-200">Revisão inteligente</p>
        <h1 className="text-3xl font-semibold text-slate-50">Flashcards do dia</h1>
        <p className="text-sm text-slate-400">Cartões selecionados pelo cognitive-analyzer e classificados conforme dificuldade.</p>
      </div>

      <Card className="border-white/5 bg-slate-900/60">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardDescription>Preparação</CardDescription>
            <CardTitle>Treine vocabulário e respostas rápidas</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">Fácil/Médio/Difícil</Badge>
            <Badge variant="neutral">Animações leves</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          <p>Use os botões para indicar o nível de facilidade. A fila se reorganiza para priorizar o que precisa de reforço.</p>
          <p className="text-xs text-slate-500">Os dados podem ser substituídos pela API de spaced repetition do cognitive-analyzer.</p>
        </CardContent>
      </Card>

      <FlashcardReview cards={cards} />
    </div>
  );
}
