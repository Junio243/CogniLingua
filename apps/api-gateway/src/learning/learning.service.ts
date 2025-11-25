import { Injectable } from '@nestjs/common';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';

@Injectable()
export class LearningService {
  /**
   * Encaminha o webhook para o backend (simulação de chamada gRPC).
   * Em um ambiente real, aqui faríamos a chamada gRPC para o serviço responsável.
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
