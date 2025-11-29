'use client';

import { useMemo, useState, useTransition } from 'react';

import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '../../../../components/ui/modal';
import { Progress } from '../../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import type { Flashcard } from '../../../../types/learning';
import { postLessonCompleted } from '../../../../services/learningApi';
import type { LessonDetail } from './data';

function FlashcardStack({ cards }: { cards: Flashcard[] }) {
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card, index) => (
        <div
          key={`${card.front}-${index}`}
          className="group relative min-h-[120px] cursor-pointer rounded-2xl border border-white/5 bg-slate-900/60 p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary-400/40"
          onClick={() => setRevealedIndex(revealedIndex === index ? null : index)}
        >
          <p className="text-sm font-semibold text-slate-100">{card.front}</p>
          <p
            className={`mt-2 text-sm text-slate-400 transition ${revealedIndex === index ? 'animate-flip opacity-100' : 'opacity-60 group-hover:opacity-90'}`}
          >
            {revealedIndex === index ? card.back : 'Toque para revelar a resposta'}
          </p>
        </div>
      ))}
    </div>
  );
}

export function LessonPlayer({
  lesson,
  flashcards,
  recommendation,
}: {
  lesson: LessonDetail;
  flashcards: Flashcard[];
  recommendation?: { id: string; title: string; description?: string };
}) {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [isPending, startTransition] = useTransition();
  const correctCount = useMemo(
    () =>
      lesson.quiz.reduce((total, question, idx) => {
        return total + (answers[idx] === question.answerIndex ? 1 : 0);
      }, 0),
    [answers, lesson.quiz],
  );

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const submitLesson = () => {
    setStatus('saving');
    const score = Math.round((correctCount / Math.max(lesson.quiz.length, 1)) * 100);

    startTransition(async () => {
      try {
        await postLessonCompleted({
          studentId: 'demo-student',
          lessonId: lesson.id,
          score,
          timestamp: new Date().toISOString(),
          metadata: { moduleId: lesson.moduleId, questions: lesson.quiz.length },
        });
        setStatus('done');
      } catch (error) {
        console.error('[lesson] postLessonCompleted failed', error);
        setStatus('error');
      }
    });
  };

  return (
    <Card className="border-primary-400/10 bg-slate-900/50">
      <CardHeader>
        <CardDescription>Player da lição</CardDescription>
        <CardTitle className="text-2xl">Conteúdo + Quiz + Flashcards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="conteudo">
          <TabsList>
            <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          </TabsList>

          <TabsContent value="conteudo">
            <div className="space-y-3">
              {lesson.sections.map((section) => (
                <div key={section.title} className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                  <p className="text-sm font-semibold text-slate-100">{section.title}</p>
                  <p className="text-sm text-slate-400">{section.body}</p>
                </div>
              ))}
              <p className="text-xs text-slate-500">Conteúdo pronto para sincronizar com o cognitive-analyzer.</p>
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <div className="space-y-3">
              {lesson.quiz.map((question, idx) => {
                const chosen = answers[idx];
                const isCorrect = chosen === question.answerIndex;
                return (
                  <div key={question.question} className="space-y-2 rounded-xl border border-white/5 bg-slate-900/60 p-4">
                    <p className="text-sm font-semibold text-slate-100">{question.question}</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = optionIndex === chosen;
                        return (
                          <button
                            key={option}
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                              isSelected
                                ? 'border-primary-400/50 bg-primary-500/10 text-slate-50'
                                : 'border-white/5 bg-slate-900/40 text-slate-200 hover:border-white/15'
                            }`}
                            onClick={() => handleAnswer(idx, optionIndex)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {chosen !== undefined ? (
                      <p className={`text-sm ${isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {isCorrect ? 'Boa! ' : 'Ajuste: '} {question.explanation}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="flashcards">
            <FlashcardStack cards={flashcards} />
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div>
            <p className="text-sm text-slate-300">Pontuação estimada: {isNaN(correctCount) ? 0 : correctCount} / {lesson.quiz.length}</p>
            <Progress value={(correctCount / Math.max(lesson.quiz.length, 1)) * 100} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={submitLesson} disabled={isPending}>
              {status === 'saving' ? 'Enviando...' : status === 'done' ? 'Lição registrada' : 'Marcar como concluída'}
            </Button>
            {recommendation ? (
              <Modal>
                <ModalTrigger asChild>
                  <Button size="sm" variant="default" disabled={status === 'saving'}>
                    Ver próxima recomendação
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Próxima recomendação</ModalTitle>
                    <ModalDescription>
                      Sugestão automática com base no cognitive-analyzer e conclusão desta lição.
                    </ModalDescription>
                  </ModalHeader>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-100">{recommendation.title}</p>
                    <p className="text-sm text-slate-400">{recommendation.description ?? 'Ajustamos o foco para manter fluidez e consolidar vocabulário.'}</p>
                  </div>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="secondary">Fechar</Button>
                    </ModalClose>
                    <Button asChild>
                      <a href={`/learning/lessons/${recommendation.id}`}>Ir para a recomendação</a>
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            ) : null}
          </div>
        </div>

        {status === 'error' ? (
          <p className="text-sm text-red-300">Não foi possível registrar a conclusão agora. Tente novamente em instantes.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
