import { Injectable } from '@nestjs/common';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';

@Injectable()
export class LearningService {
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
}