import type { Metadata } from 'next';
import Link from 'next/link';
import type { LearningModule } from './data';
import { fetchModulesCached as fetchModules } from './data';

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
    <div className="module-badges" aria-label="Critérios de conclusão">
      {criteria.minAccuracy ? <span>🎯 {Math.round(criteria.minAccuracy * 100)}% acurácia</span> : null}
      {criteria.minExercises ? <span>✅ {criteria.minExercises}+ exercícios</span> : null}
      {criteria.minVocabulary ? <span>🧠 {criteria.minVocabulary}+ vocabulário</span> : null}
    </div>
  );
}

export default async function ModulesPage() {
  const modules = await fetchModules();

  return (
    <section className="module-grid">
      {modules.map((module) => (
        <article key={module.id} className="module-card">
          <header>
            <p className="muted">Módulo</p>
            <h2>{module.title}</h2>
          </header>

          {module.objectives && module.objectives.length ? (
            <ul className="muted">
              {module.objectives.map((objective) => (
                <li key={objective}>• {objective}</li>
              ))}
            </ul>
          ) : null}

          <CompletionBadge criteria={module.completionCriteria} />

          <div className="module-footer">
            <div>
              <p className="muted">Pré-requisitos</p>
              <span>{module.prerequisites && module.prerequisites.length > 0 ? module.prerequisites.join(', ') : 'Livre acesso'}</span>
            </div>
            <Link href={`/learning/modules/${module.id}`} className="cta-link">
              Abrir módulo
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
