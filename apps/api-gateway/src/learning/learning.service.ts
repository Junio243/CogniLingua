import { Injectable, Logger } from '@nestjs/common';
import { CurriculumNextDto } from './dto/curriculum-next.dto';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';

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
  ): Promise<{ nextConceptId: string; rationale: string }> {
    const { studentId, cognitiveLoadOverride } = payload;

    // Stub gRPC: no ambiente atual apenas registramos a intenção de chamada.
    this.logger.log({
      studentId,
      cognitiveLoadOverride,
      target: 'student-profiler',
    }, '📡 Encaminhando ajuste de carga cognitiva via gRPC');

    this.logger.log({
      studentId,
      cognitiveLoadOverride,
      currentConceptId: payload.currentConceptId,
      mastery: payload.mastery,
      target: 'content-brain',
    }, '📡 Requisitando próximo conceito via gRPC');

    // Mantém a resposta stub original, mas agora incluindo o override no racional.
    const nextConceptId = payload.currentConceptId
      ? `${payload.currentConceptId}-next`
      : 'concept-0001';

    const rationaleSegments = ['Recomendação baseada em progresso recente (stub).'];

    if (typeof cognitiveLoadOverride === 'number') {
      rationaleSegments.push(
        `Carga cognitiva sobrescrita para ${cognitiveLoadOverride * 100}% enviada ao orquestrador gRPC.`,
      );
    }

    return {
      nextConceptId,
      rationale: rationaleSegments.join(' '),
    };
  }
}