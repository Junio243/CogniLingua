import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchModuleById } from '../data';

interface ModulePageProps {
  params: {
    moduleId: string;
  };
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const module = await fetchModuleById(params.moduleId);

  return {
    title: module ? `${module.title} | Módulo` : `Módulo ${params.moduleId}`,
    description: module
      ? `Objetivos: ${(module.objectives ?? []).join(', ') || 'aperfeiçoar seu espanhol.'}`
      : 'Detalhes do módulo selecionado com caminhos de prática e recomendações.',
  };
}

export default async function ModuleDetailPage({ params }: ModulePageProps) {
  const module = await fetchModuleById(params.moduleId);

  return (
    <section className="module-detail">
      <header>
        <p className="muted">Módulo</p>
        <h1>{module?.title ?? 'Módulo em preparação'}</h1>
        <p className="muted">
          {module?.objectives?.length
            ? module.objectives.join(' · ')
            : 'Preparamos este módulo para acompanhar seu ritmo de estudos.'}
        </p>
      </header>

      <div className="module-detail-grid">
        <article className="card">
          <h3>Critérios de conclusão</h3>
          <ul className="muted">
            <li>
              Acurácia mínima: {module?.completionCriteria?.minAccuracy ? `${module.completionCriteria.minAccuracy * 100}%` : 'defina no seu plano'}
            </li>
            <li>
              Exercícios: {module?.completionCriteria?.minExercises ?? 'personalize'}
            </li>
            <li>
              Vocabulário: {module?.completionCriteria?.minVocabulary ?? 'personalize'}
            </li>
          </ul>
        </article>

        <article className="card">
          <h3>Próximos passos</h3>
          <p className="muted">Continue sua trilha com as lições recomendadas.</p>
          <div className="module-actions">
            <Link href={`/learning/lessons/${params.moduleId}-intro`} className="cta-link">
              Abrir lição
            </Link>
            <Link href="/learning/modules" className="ghost-link">
              Voltar para módulos
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
