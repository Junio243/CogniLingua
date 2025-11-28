import type { Metadata } from 'next';
import Link from 'next/link';

interface LessonPageProps {
  params: {
    lessonId: string;
  };
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const title = params.lessonId.replace(/-/g, ' ');

  return {
    title: `Lição: ${title} | CogniLingua`,
    description: `Prática guiada para a lição ${title}. Ajuste o nível e acompanhe feedback imediato.`,
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <section className="lesson-page">
      <header>
        <p className="muted">Lição</p>
        <h1>{params.lessonId.replace(/-/g, ' ')}</h1>
        <p className="muted">
          Configure ritmo e idioma para receber explicações contextualizadas enquanto pratica.
        </p>
      </header>

      <div className="lesson-actions">
        <Link href="/learning/modules" className="ghost-link">
          Voltar para módulos
        </Link>
        <Link href={`/learning/lessons/${params.lessonId}/praticar`} className="cta-link">
          Continuar praticando
        </Link>
      </div>
    </section>
  );
}
