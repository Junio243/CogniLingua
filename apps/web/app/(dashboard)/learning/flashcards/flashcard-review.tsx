'use client';

import { useMemo, useState } from 'react';

import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Progress } from '../../../../components/ui/progress';
import type { Flashcard } from '../../../../types/learning';

export type ReviewLevel = 'easy' | 'medium' | 'hard';

function nextInterval(current: number, level: ReviewLevel): number {
  if (level === 'easy') return current + 3;
  if (level === 'medium') return current + 2;
  return current + 1;
}

export function FlashcardReview({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [streak, setStreak] = useState(0);
  const [queue, setQueue] = useState(() =>
    cards.map((card, idx) => ({ ...card, interval: 1, ease: 2.5, id: `${card.front}-${idx}` })),
  );

  const progress = useMemo(() => Math.round(((index % queue.length) / queue.length) * 100), [index, queue.length]);
  const current = queue[index % queue.length];

  const handleReview = (level: ReviewLevel) => {
    setShowBack(false);
    setStreak((prev) => (level === 'hard' ? 0 : prev + 1));

    setQueue((prev) => {
      const updated = [...prev];
      const currentCard = { ...updated[index % prev.length] };
      currentCard.interval = nextInterval(currentCard.interval, level);
      currentCard.ease = Math.max(1.3, currentCard.ease + (level === 'easy' ? 0.15 : level === 'medium' ? 0 : -0.2));

      updated.splice(index % prev.length, 1);
      const insertAt = Math.min(updated.length, currentCard.interval);
      updated.splice(insertAt, 0, currentCard);
      return updated;
    });

    setIndex((prev) => prev + 1);
  };

  return (
    <Card className="border-white/5 bg-slate-900/60">
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Fluxo de spaced repetition</p>
          <CardTitle className="text-2xl">Flashcards diários</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{queue.length} cartões</Badge>
          <Badge variant="neutral">Streak {streak}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-primary-400/10 bg-surface-muted/60 p-6 shadow-card">
          <p className="text-sm text-slate-400">Frente</p>
          <p className="mt-2 text-xl font-semibold text-slate-50">{current.front}</p>
          <p className={`mt-6 text-sm text-slate-300 transition ${showBack ? 'opacity-100' : 'opacity-50'}`}>
            {showBack ? current.back : 'Toque em Revelar para ver a resposta.'}
          </p>
          <div className="mt-3 flex gap-2">
            <Badge variant="neutral">Intervalo {current.interval}d</Badge>
            <Badge variant="outline">Facilidade {current.ease.toFixed(2)}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div className="w-full sm:w-auto sm:flex-1">
            <p className="text-sm text-slate-400">Progresso</p>
            <Progress value={progress} />
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowBack(true)}>
              Revelar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleReview('hard')}>
              Difícil
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleReview('medium')}>
              Médio
            </Button>
            <Button size="sm" onClick={() => handleReview('easy')}>
              Fácil
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-1 text-sm text-slate-400">
        <p>A lógica acima simula prioridades de espaçamento. Substitua pelo retorno do cognitive-analyzer para usar tempos reais.</p>
        <p>As animações leves ajudam na percepção de avanço e mantêm o usuário engajado.</p>
      </CardFooter>
    </Card>
  );
}
