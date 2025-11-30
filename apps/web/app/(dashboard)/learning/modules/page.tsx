import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import type { LearningModule } from './data';
import { fetchModules } from './data';

export async function generateMetadata(): Promise<Metadata> {
  const modules = await fetchModules();
  const titles = modules.map((module) => module.title).slice(0, 3).join(', ');

  return {
    title: `Módulos (${modules.length}) | CogniLingua`,
    description:
      titles.length > 0
        ? `Trilha ativa com: ${titles}${modules.length > 3 ? ' e outros' : ''}.`
        : 'Trilha ativa de módulos de espanhol para personalizar seu estudo.',
  };
}

function CompletionBadge({ criteria }: { criteria?: LearningModule['completionCriteria'] }) {
  if (!criteria) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Critérios de conclusão">
      {criteria.minAccuracy ? <Badge>🎯 {Math.round(criteria.minAccuracy * 100)}% acurácia</Badge> : null}
      {criteria.minExercises ? <Badge variant="neutral">✅ {criteria.minExercises}+ exercícios</Badge> : null}
      {criteria.minVocabulary ? <Badge variant="outline">🧠 {criteria.minVocabulary}+ vocabulário</Badge> : null}
    </div>
  );
}

export default async function ModulesPage() {
  const modules = await fetchModules();

  return (
    <section className="card-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modules.map((module) => (
        <Card key={module.id} className="group border-white/5 bg-slate-900/40 transition hover:-translate-y-0.5 hover:border-primary-400/30 hover:shadow-glow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="neutral">Módulo</Badge>
              {module.prerequisites?.length ? (
                <Badge variant="outline">{module.prerequisites.length} pré-req.</Badge>
              ) : (
                <Badge variant="outline">Livre</Badge>
              )}
            </div>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription>
              {module.objectives && module.objectives.length
                ? module.objectives.slice(0, 3).join(' · ')
                : 'Objetivos serão sugeridos conforme seu perfil.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <CompletionBadge criteria={module.completionCriteria} />
            {module.prerequisites?.length ? (
              <p className="text-sm text-slate-400">Pré-requisitos: {module.prerequisites.join(', ')}</p>
            ) : (
              <p className="text-sm text-slate-400">Sem bloqueios de acesso para este módulo.</p>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Abertura</p>
              <p className="text-sm text-slate-200">Conteúdo adaptado ao seu ritmo</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link href={`/learning/modules/${module.id}`}>Abrir módulo</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
