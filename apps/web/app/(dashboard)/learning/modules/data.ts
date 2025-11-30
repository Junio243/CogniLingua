import type { Module } from '../../../../types/learning';
import { getModuleById, getModules } from '../../../../services/learningApi';
import type { HttpClientOptions } from '../../../../services/httpClient';
import { getServerSession } from '../../../../lib/auth/session';

export type LearningModule = Module;

async function resolveOptions(): Promise<HttpClientOptions> {
  const session = await getServerSession();
  return {
    mode: 'ssr',
    withCredentials: true,
    authToken: session?.token,
  };
}

export async function fetchModules(): Promise<LearningModule[]> {
  return getModules(await resolveOptions());
}

export async function fetchModuleById(moduleId: string): Promise<LearningModule | undefined> {
  const options = await resolveOptions();
  const modules = await getModules(options);
  return modules.find((module) => module.id === moduleId) ?? (await getModuleById(moduleId, options));
}
