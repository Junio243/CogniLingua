import { cache } from 'react';

export type LearningModule = {
  id: string;
  title: string;
  prerequisites?: string[];
  objectives?: string[];
  completionCriteria?: {
    minAccuracy?: number;
    minExercises?: number;
    minVocabulary?: number;
  };
};

const FALLBACK_MODULES: LearningModule[] = [
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

export async function fetchModules(): Promise<LearningModule[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.API_GATEWAY_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/learning/modules`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Falha ao buscar módulos: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('[modules] fallback list used:', error);
    return FALLBACK_MODULES;
  }
}

export const fetchModulesCached = cache(fetchModules);

export async function fetchModuleById(moduleId: string): Promise<LearningModule | undefined> {
  const modules = await fetchModulesCached();
  return modules.find((module) => module.id === moduleId);
}
