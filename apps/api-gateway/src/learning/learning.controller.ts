import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import { LearningService } from './learning.service';

@Controller('learning')
export class LearningController {
  private readonly logger = new Logger(LearningController.name);

  constructor(private readonly learningService: LearningService) {}

  // 👉 Endpoint acessável pelo navegador (GET)
  @Get('status')
  getStatus() {
    return {
      ok: true,
      message: 'API Gateway está rodando 👌',
      timestamp: new Date().toISOString(),
    };
  }

  // 👉 Endpoint usado pelo webhook (POST)
  @Post('lesson-completed')
  async handleLessonCompletedWebhook(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    payload: LessonCompletedWebhookDto,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      {
        studentId: payload.studentId,
        lessonId: payload.lessonId,
        score: payload.score,
        timestamp: payload.timestamp,
      },
      '✅ Lesson completed webhook recebido',
    );

    return this.learningService.forwardLessonCompleted(payload);
  }
}
