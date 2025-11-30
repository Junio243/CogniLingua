"use client";

import { Suspense, type ReactNode, Component } from 'react';
import {
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { useAuth, useHttpClient } from '../../providers';
import { fetchDashboardData, type DashboardData } from './data';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-20 rounded bg-slate-800" />
              <div className="mt-2 h-7 w-28 rounded bg-slate-800" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-3 w-full rounded bg-slate-800" />
              <div className="h-3 w-5/6 rounded bg-slate-800" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 w-32 rounded bg-slate-800" />
          <div className="mt-2 h-6 w-48 rounded bg-slate-800" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-3 w-full rounded bg-slate-800" />
          <div className="h-3 w-5/6 rounded bg-slate-800" />
        </CardContent>
      </Card>
    </div>
  );
}

class DashboardErrorBoundary extends Component<{ onRetry: () => void; children: ReactNode }, { error: Error | null }> {
  constructor(props: { onRetry: () => void; children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  handleRetry = () => {
    this.setState({ error: null });
    this.props.onRetry();
  };

  render() {
    if (this.state.error) {
      return (
        <Card className="border-red-500/30 bg-red-900/20">
          <CardHeader>
            <CardTitle>Não foi possível carregar o painel</CardTitle>
            <CardDescription>{this.state.error.message}</CardDescription>
          </CardHeader>
          <CardFooter className="gap-3">
            <Button onClick={this.handleRetry}>Tentar novamente</Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

function DashboardDataView({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-primary-400/5 to-transparent" />
          <CardHeader className="relative">
            <CardDescription>Taxa de acerto</CardDescription>
            <div className="flex items-end gap-2">
              <CardTitle className="text-3xl">{data.progress.accuracy}%</CardTitle>
              <Badge variant="neutral">Últimos 7 dias</Badge>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3">
            <Progress value={data.progress.accuracy} />
            <p className="text-sm text-slate-400">
              {data.progress.exercisesCompleted} exercícios concluídos com {data.progress.vocabularyMastered} termos dominados.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Streak ativa</CardDescription>
            <CardTitle className="text-3xl">{data.progress.streak} dias 🔥</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">Estabilidade reconhecida pelo modelo de hábito linguístico.</p>
            <div className="mt-3 flex gap-2">
              <Badge>Sem pular dias</Badge>
              <Badge variant="outline">+{data.progress.weeklyMinutes}min/sem</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Próximo módulo sugerido</CardDescription>
            <CardTitle className="text-xl">{data.progress.nextSuggestedModule}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-400">Gerado pelo cognitive-analyzer considerando aderência e vocabulário.</p>
            <Button asChild variant="secondary" size="sm">
              <a href={`/learning/modules/${data.progress.nextSuggestedModule}`}>Ir para o módulo</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Minutos na semana</CardDescription>
            <CardTitle className="text-3xl">{data.progress.weeklyMinutes} min</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={Math.min(100, (data.progress.weeklyMinutes / 150) * 100)} />
            <p className="text-sm text-slate-400">Meta configurada em 150 minutos.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardDescription>Próxima lição recomendada</CardDescription>
              <CardTitle>{data.nextItem.title}</CardTitle>
              <p className="text-sm text-slate-400">{data.nextItem.description}</p>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="neutral">Módulo {data.activeModule?.id ?? 'em aberto'}</Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {data.activeModule?.title ?? 'Você pode selecionar qualquer módulo ativo para refinar as sugestões.'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="outline">Diagnóstico ativo</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                <p className="text-xs uppercase text-slate-500">Acurácia</p>
                <p className="text-xl font-semibold text-slate-50">{data.progress.accuracy}%</p>
                <p className="text-sm text-slate-400">Meta automática: 88%</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                <p className="text-xs uppercase text-slate-500">Vocabulário</p>
                <p className="text-xl font-semibold text-slate-50">{data.progress.vocabularyMastered} termos</p>
                <p className="text-sm text-slate-400">Inclui expressões de fala espontânea.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4">
                <p className="text-xs uppercase text-slate-500">Exercícios</p>
                <p className="text-xl font-semibold text-slate-50">{data.progress.exercisesCompleted}</p>
                <p className="text-sm text-slate-400">Sequências concluídas com feedback imediato.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-400/10 bg-primary-500/5 p-4">
              <div>
                <p className="text-sm text-slate-300">Prepare-se com cartões do dia para chegar aquecido na lição.</p>
                <p className="text-xs text-primary-200">Flashcards alinhados com os mesmos conceitos que serão cobrados.</p>
              </div>
              <Button asChild>
                <a href="/learning/flashcards">Revisar antes de começar</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Flashcards do dia</CardDescription>
            <CardTitle>Seleção dinâmica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.flashcards.map((card, index) => (
              <div
                key={`${card.front}-${index}`}
                className="rounded-xl border border-white/5 bg-slate-900/60 p-3 transition hover:border-primary-400/30"
              >
                <p className="text-sm font-semibold text-slate-100">{card.front}</p>
                <p className="text-sm text-slate-400">{card.back}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter className="justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500">Gerados para hoje</p>
              <p className="text-sm text-slate-200">{data.flashcards.length} cartões alinhados com o módulo atual.</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <a href="/learning/flashcards">Abrir deck</a>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Trilha ativa</CardDescription>
            <CardTitle>Módulos em andamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.modules.slice(0, 4).map((module) => (
              <div key={module.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/60 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{module.title}</p>
                  <p className="text-xs text-slate-500">{module.prerequisites?.length ? 'Com pré-requisito' : 'Acesso livre'}</p>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <a href={`/learning/modules/${module.id}`}>Entrar</a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Flash insights</CardDescription>
            <CardTitle>Foco do cognitive-analyzer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-300">
              Priorizamos tópicos com menor acurácia, combinando tempo de resposta, hesitação e similaridade semântica.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Concordância verbal no pretérito imperfeito</li>
              <li>• Conectivos de opinião ("creo que", "me parece")</li>
              <li>• Padrões de convite informal</li>
            </ul>
            <p className="text-xs text-slate-500">Pronto para receber dados brutos do serviço cognitive-analyzer.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DashboardDataFetcher() {
  const queryClient = useQueryClient();
  const { session, status, error, refresh } = useAuth();
  const { applyAuth } = useHttpClient();

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (status !== 'authenticated' || !session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sessão não encontrada</CardTitle>
          <CardDescription>
            {error ?? 'Faça login novamente para recuperar seus dados e acessar o painel.'}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => refresh().then(() => queryClient.invalidateQueries())}>Revalidar sessão</Button>
        </CardFooter>
      </Card>
    );
  }

  const query = useSuspenseQuery({
    queryKey: ['dashboard', session.studentId],
    queryFn: () => fetchDashboardData({ studentId: session.studentId, httpOptions: applyAuth({ mode: 'csr' }) }),
    staleTime: 1000 * 60,
    retry: 1,
  });

  return <DashboardDataView data={query.data} />;
}

export function DashboardContent() {
  const queryClient = useQueryClient();

  return (
    <DashboardErrorBoundary onRetry={() => queryClient.invalidateQueries({ queryKey: ['dashboard'] })}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardDataFetcher />
      </Suspense>
    </DashboardErrorBoundary>
  );
}
