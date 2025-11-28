import { Injectable, Logger } from '@nestjs/common';
import { CurriculumNextDto } from './dto/curriculum-next.dto';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import {
  CurriculumNextResponse,
  CurriculumSignal,
} from '@cognilingua/shared';

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);

  /**
   * Método mantido apenas para compatibilidade com testes.
   * TODO: Remover após atualizar os testes para usar a nova arquitetura.
   */
  async forwardLessonCompleted(
    payload: LessonCompletedWebhookDto,
  ): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Lesson ${payload.lessonId} para aluno ${payload.studentId} encaminhada via gRPC (mock).`,
    };
  }

  /**
   * Simula o encaminhamento gRPC para o student-profiler e content-brain.
   * Inclui o novo campo cognitiveLoadOverride no payload encaminhado.
   */
  async forwardCurriculumRequest(
    payload: CurriculumNextDto,
  ): Promise<CurriculumNextResponse> {
    const signal: CurriculumSignal = {
      studentId: payload.studentId,
      currentConceptId: payload.currentConceptId,
      mastery: payload.mastery,
      cognitiveLoadOverride: payload.cognitiveLoadOverride,
      accuracyPercent: payload.accuracyPercent,
      exercisesCompleted: payload.exercisesCompleted,
      correlationId: payload.correlationId ?? this.generateCorrelationId(),
      eventTimestamp: payload.eventTimestamp ?? Date.now(),
    };

    // Stub gRPC: no ambiente atual apenas registramos a intenção de chamada.
    this.logger.log(
      {
        ...signal,
        target: 'student-profiler',
      },
      '📡 Encaminhando ajuste de carga cognitiva via gRPC',
    );

    this.logger.log(
      {
        ...signal,
        target: 'content-brain',
      },
      '📡 Requisitando próximo conceito via gRPC',
    );

    // Mantém a resposta stub original, mas agora incluindo o override no racional.
    const nextConceptId = payload.currentConceptId
      ? `${payload.currentConceptId}-next`
      : 'concept-0001';

    const rationaleSegments = ['Recomendação baseada em progresso recente (stub).'];

    if (typeof signal.cognitiveLoadOverride === 'number') {
      rationaleSegments.push(
        `Carga cognitiva sobrescrita para ${Number(signal.cognitiveLoadOverride) * 100}% enviada ao orquestrador gRPC.`,
      );
    }

    if (typeof signal.accuracyPercent === 'number') {
      rationaleSegments.push(
        `Acurácia recente reportada: ${Number(signal.accuracyPercent) * 100}% (corr ${signal.correlationId}).`,
      );
    }

    return {
      nextConceptId,
      rationale: rationaleSegments.join(' '),
      recommendedLoad:
        typeof signal.cognitiveLoadOverride === 'number'
          ? Number(signal.cognitiveLoadOverride)
          : undefined,
      projectedMastery:
        typeof signal.mastery === 'number'
          ? Math.min(1, Number(signal.mastery) + 0.05)
          : undefined,
      correlationId: signal.correlationId,
    };
  }

  private generateCorrelationId(): string {
    return `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }
}