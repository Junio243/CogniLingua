import { cache } from 'react';

import type { Flashcard, Module } from '../../../types/learning';
import {
  getModules,
  getNextItem,
  getSpanishFlashcards,
  type NextItemProgress,
  type NextItemResponse,
} from '../../../services/learningApi';

const fallbackFlashcards: Flashcard[] = [
  { front: '¿Cómo amaneciste?', back: 'Como você acordou?/Como está se sentindo hoje de manhã?' },
  { front: 'Estoy repasando los verbos irregulares', back: 'Estou revisando os verbos irregulares.' },
  { front: '¿Te parece si practicamos a las 19h?', back: 'Que tal praticarmos às 19h?' },
  { front: 'Me quedé sin batería', back: 'Fiquei sem bateria (do celular).' },
];

const fallbackProgress: NextItemProgress = {
  currentAccuracy: 0.82,
  exercisesCompleted: 16,
  vocabularyMastered: 22,
  nextSuggestedModule: 'basico-2',
};

async function fetchFlashcards(studentId: string, conceptId: string): Promise<Flashcard[]> {
  try {
    const { cards } = await getSpanishFlashcards({ studentId, conceptId, limit: 6 });
    return cards?.length ? cards : fallbackFlashcards;
  } catch (error) {
    console.error('[dashboard] fallback flashcards used:', error);
    return fallbackFlashcards;
  }
}

async function fetchNextItemSummary(payload: {
  studentId: string;
  moduleId?: string;
  exercisesCompleted: number;
  accuracyPercent: number;
}): Promise<NextItemResponse | { nextItem: string; progress: NextItemProgress }> {
  try {
    return await getNextItem(payload, 'csr');
  } catch (error) {
    console.warn('[dashboard] fallback next item used:', error);
    return {
      nextItem: 'Diálogo guiado sobre rotina',
      progress: fallbackProgress,
    };
  }
}

export const fetchDashboardData = cache(async () => {
  const modules = await getModules();
  const activeModule = modules[0];
  const studentId = 'demo-student';

  const nextItemResult = await fetchNextItemSummary({
    studentId,
    moduleId: activeModule?.id,
    exercisesCompleted: 12,
    accuracyPercent: (fallbackProgress.currentAccuracy ?? 0.8) * 100,
  });

  const flashcards = await fetchFlashcards(studentId, activeModule?.id ?? 'basico-1');

  return {
    modules,
    activeModule,
    flashcards,
    nextItem: {
      title: nextItemResult.nextItem,
      moduleId: activeModule?.id,
      description:
        'Gerado pelo cognitive-analyzer com base no histórico recente e aderência ao módulo ativo.',
    },
    progress: {
      accuracy: Math.round((nextItemResult.progress.currentAccuracy ?? 0.82) * 100),
      exercisesCompleted: nextItemResult.progress.exercisesCompleted ?? 0,
      vocabularyMastered: nextItemResult.progress.vocabularyMastered ?? 0,
      nextSuggestedModule: nextItemResult.progress.nextSuggestedModule ?? activeModule?.id ?? 'basico-1',
      streak: 6,
      weeklyMinutes: 115,
    },
  } satisfies {
    modules: Module[];
    activeModule?: Module;
    flashcards: Flashcard[];
    nextItem: { title: string; moduleId?: string; description: string };
    progress: {
      accuracy: number;
      exercisesCompleted: number;
      vocabularyMastered: number;
      nextSuggestedModule: string;
      streak: number;
      weeklyMinutes: number;
    };
  };
});
