import { httpClient, httpGet, httpPost, type FetchMode, type HttpClientOptions } from './httpClient';
import type { Flashcard, LessonCompletedEvent, Module } from '../types/learning';

type LearningRequestOptions = HttpClientOptions & { mode?: FetchMode };

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

export async function getModules(options: LearningRequestOptions = {}): Promise<Module[]> {
  return httpGet<Module[]>('/learning/modules', options);
}

export async function getModuleById(
  moduleId: string,
  options: LearningRequestOptions = {},
): Promise<Module | undefined> {
  const modules = await getModules(options);
  return modules.find((module) => module.id === moduleId);
}

export async function getNextItem(
  payload: NextItemPayload,
  options: LearningRequestOptions = {},
): Promise<NextItemResponse> {
  return httpPost<NextItemResponse>('/learning/next-item', payload, options);
}

export async function postLessonCompleted(
  payload: LessonCompletedEvent,
  options: LearningRequestOptions = {},
): Promise<{ success: boolean; message: string; processedAt?: string }> {
  return httpPost<{ success: boolean; message: string; processedAt?: string }>(
    '/learning/lesson-completed',
    payload,
    options,
  );
}

export async function getSpanishFlashcards(
  payload: SpanishFlashcardsPayload,
  options: LearningRequestOptions = {},
): Promise<{ conceptId: string; cards: Flashcard[] }> {
  return httpPost<{ conceptId: string; cards: Flashcard[] }>('/learning/spanish/cards', payload, options);
}

export const learningApi = {
  baseUrl: httpClient.baseUrl,
  getModules,
  getModuleById,
  getNextItem,
  postLessonCompleted,
  getSpanishFlashcards,
};
