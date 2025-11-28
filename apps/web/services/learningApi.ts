import { httpClient, httpGet, httpPost, type FetchMode } from './httpClient';
import type { Flashcard, LessonCompletedEvent, Module } from '../types/learning';

const FALLBACK_MODULES: Module[] = [
  {
    id: 'basico-1',
    title: 'Saudações e Apresentações',
    prerequisites: [],
    objectives: ['Cumprimentar', 'Se apresentar'],
    completionCriteria: { minAccuracy: 0.8, minExercises: 8, minVocabulary: 6 },
  },
  {
    id: 'basico-2',
    title: 'Rotina e Números',
    prerequisites: ['basico-1'],
    objectives: ['Descrever rotina', 'Falar de horários'],
    completionCriteria: { minAccuracy: 0.8, minExercises: 10, minVocabulary: 7 },
  },
];

export type NextItemProgress = {
  currentAccuracy: number | null;
  exercisesCompleted: number;
  vocabularyMastered: number;
  nextSuggestedModule: string | null;
};

export type NextItemResponse = {
  nextItem: string;
  progress: NextItemProgress;
};

export type NextItemPayload = {
  studentId: string;
  moduleId?: string;
  completedItemIds?: string[];
  accuracyPercent?: number;
  exercisesCompleted?: number;
};

export type SpanishFlashcardsPayload = {
  studentId: string;
  conceptId: string;
  limit?: number;
};

export async function getModules(mode: FetchMode = 'ssr'): Promise<Module[]> {
  try {
    return await httpGet<Module[]>('/learning/modules', { mode });
  } catch (error) {
    console.error('[learningApi] fallback modules used:', error);
    return FALLBACK_MODULES;
  }
}

export async function getModuleById(moduleId: string, mode: FetchMode = 'ssr'): Promise<Module | undefined> {
  const modules = await getModules(mode);
  return modules.find((module) => module.id === moduleId);
}

export async function getNextItem(payload: NextItemPayload, mode: FetchMode = 'csr'): Promise<NextItemResponse> {
  return httpPost<NextItemResponse>('/learning/next-item', payload, { mode });
}

export async function postLessonCompleted(
  payload: LessonCompletedEvent,
  mode: FetchMode = 'csr',
): Promise<{ success: boolean; message: string; processedAt?: string }> {
  return httpPost<{ success: boolean; message: string; processedAt?: string }>(
    '/learning/lesson-completed',
    payload,
    {
      mode,
    },
  );
}

export async function getSpanishFlashcards(
  payload: SpanishFlashcardsPayload,
  mode: FetchMode = 'csr',
): Promise<{ conceptId: string; cards: Flashcard[] }> {
  return httpPost<{ conceptId: string; cards: Flashcard[] }>('/learning/spanish/cards', payload, {
    mode,
  });
}

export const learningApi = {
  baseUrl: httpClient.baseUrl,
  getModules,
  getModuleById,
  getNextItem,
  postLessonCompleted,
  getSpanishFlashcards,
};
