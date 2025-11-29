import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { getSpanishFlashcards } from '../../../../../services/learningApi';
import type { Flashcard } from '../../../../../types/learning';
import { LessonPlayer } from '../lesson-player';
import { getFallbackCards, getLessonById, lessons } from '../data';

export async function generateMetadata({ params }: { params: { lessonId: string } }): Promise<Metadata> {
  const lesson = getLessonById(params.lessonId);
  return {
    title: `${lesson.title} | CogniLingua`,
    description: lesson.description ?? 'Lição interativa com conteúdo, quiz e flashcards.',
  };
}

async function fetchFlashcardsForLesson(lessonId: string): Promise<Flashcard[]> {
  try {
    const { cards } = await getSpanishFlashcards({ studentId: 'demo-student', conceptId: lessonId, limit: 6 }, 'csr');
    return cards?.length ? cards : getFallbackCards();
  } catch (error) {
    console.warn('[lesson-page] usando flashcards fallback:', error);
    return getFallbackCards();
  }
}

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = getLessonById(params.lessonId);
  const flashcards = await fetchFlashcardsForLesson(lesson.id);
  const recommendation = lesson.nextLessonId ? lessons[lesson.nextLessonId] : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-primary-200">Módulo {lesson.moduleId}</p>
          <h1 className="text-3xl font-semibold text-slate-50">{lesson.title}</h1>
          <p className="text-sm text-slate-400">{lesson.description}</p>
          <div className="flex flex-wrap gap-2">
            {lesson.objectives.map((objective) => (
              <Badge key={objective} variant="neutral">
                {objective}
              </Badge>
            ))}
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link href="/learning/modules">Voltar para módulos</Link>
        </Button>
      </div>

      <Card className="border-white/5 bg-slate-900/60">
        <CardHeader>
          <CardDescription>Resumo</CardDescription>
          <CardTitle>Duração média: {lesson.durationMinutes ?? 15} min</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          <p>Conteúdo com slots prontos para streaming do cognitive-analyzer.</p>
          <p>Quiz validado para checar compreensão imediata antes de avançar.</p>
        </CardContent>
      </Card>

      <LessonPlayer
        lesson={lesson}
        flashcards={flashcards}
        recommendation={recommendation ? { id: recommendation.id, title: recommendation.title, description: recommendation.description } : undefined}
      />
    </div>
  );
}
