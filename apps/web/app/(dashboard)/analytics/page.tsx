import type { Metadata } from 'next';

import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Analytics | CogniLingua',
    description: 'Dificuldades por tópico e evolução temporal com dados do cognitive-analyzer.',
  };
}

const topicDifficulties = [
  { topic: 'Pretérito imperfeito', accuracy: 62, trend: '+6% vs semana passada' },
  { topic: 'Conectivos de opinião', accuracy: 54, trend: '+3% vs semana passada' },
  { topic: 'Falsos cognatos', accuracy: 71, trend: '+1% vs semana passada' },
  { topic: 'Entonação em perguntas', accuracy: 58, trend: '+4% vs semana passada' },
];

const timeline = [
  { label: 'Seg', value: 58 },
  { label: 'Ter', value: 64 },
  { label: 'Qua', value: 69 },
  { label: 'Qui', value: 72 },
  { label: 'Sex', value: 74 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-primary-200">Insights rápidos</p>
        <h1 className="text-3xl font-semibold text-slate-50">Analytics</h1>
        <p className="text-sm text-slate-400">Preparado para ingestão direta do cognitive-analyzer, com filtros por tópico e tempo.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardDescription>Dificuldades por tópico</CardDescription>
              <CardTitle>Prioridades</CardTitle>
            </div>
            <Badge variant="outline">Auto-updates</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {topicDifficulties.map((item) => (
              <div key={item.topic} className="space-y-1 rounded-xl border border-white/5 bg-slate-900/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">{item.topic}</p>
                  <span className="text-xs text-primary-200">{item.trend}</span>
                </div>
                <Progress value={item.accuracy} />
                <p className="text-xs text-slate-500">Acurácia média: {item.accuracy}%</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardDescription>Evolução temporal</CardDescription>
              <CardTitle>Precisão da semana</CardTitle>
            </div>
            <Badge variant="neutral">Rolling 7d</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {timeline.map((point) => (
                <div key={point.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-24 w-full items-end justify-center rounded-lg bg-slate-900/60 p-1">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-primary-500 to-emerald-300"
                      style={{ height: `${point.value}%` }}
                      aria-label={`Precisão ${point.value}% em ${point.label}`}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{point.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">Substitua os valores acima pelos pontos retornados pelo cognitive-analyzer.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
