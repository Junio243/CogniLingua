import type { Flashcard, Module } from '../../../types/learning';
import {
  getModules,
  getNextItem,
  getSpanishFlashcards,
  type NextItemProgress,
} from '../../../services/learningApi';
import type { HttpClientOptions } from '../../../services/httpClient';

export type DashboardData = {
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

type DashboardFetcherParams = {
  studentId: string;
  httpOptions?: HttpClientOptions;
};

export async function fetchDashboardData({
  studentId,
  httpOptions,
}: DashboardFetcherParams): Promise<DashboardData> {
  const requestOptions: HttpClientOptions = {
    mode: 'csr',
    ...httpOptions,
  };

  const modules = await getModules(requestOptions);
  const activeModule = modules[0];

  const nextItemResult = await getNextItem(
    {
      studentId,
      moduleId: activeModule?.id,
      exercisesCompleted: 12,
      accuracyPercent: 80,
    },
    requestOptions,
  );

  const flashcardsResponse = await getSpanishFlashcards(
    { studentId, conceptId: activeModule?.id ?? 'concept', limit: 6 },
    requestOptions,
  );

  const progress: NextItemProgress = nextItemResult.progress;

  return {
    modules,
    activeModule,
    flashcards: flashcardsResponse.cards ?? [],
    nextItem: {
      title: nextItemResult.nextItem,
      moduleId: activeModule?.id,
      description: 'Recomendação calculada via gateway autenticado.',
    },
    progress: {
      accuracy: Math.round((progress.currentAccuracy ?? 0) * 100),
      exercisesCompleted: progress.exercisesCompleted ?? 0,
      vocabularyMastered: progress.vocabularyMastered ?? 0,
      nextSuggestedModule: progress.nextSuggestedModule ?? activeModule?.id ?? 'n/d',
      streak: 0,
      weeklyMinutes: 0,
    },
  } satisfies DashboardData;
}
