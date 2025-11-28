import { cache } from 'react';
import type { Module } from '../../../../types/learning';
import { getModuleById, getModules } from '../../../../services/learningApi';

export type LearningModule = Module;

export const fetchModules = cache(async (): Promise<LearningModule[]> => getModules());
export const fetchModulesCached = fetchModules;

export async function fetchModuleById(moduleId: string): Promise<LearningModule | undefined> {
  const modules = await fetchModulesCached();
  return modules.find((module) => module.id === moduleId) ?? (await getModuleById(moduleId));
}
