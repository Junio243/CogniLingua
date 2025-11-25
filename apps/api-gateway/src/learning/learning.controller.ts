import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import { LearningService } from './learning.service';

@Controller('learning')
export class LearningController {
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
    console.log(
      '✅ Lesson completed webhook recebido:',
      `studentId=${payload.studentId}`,
      `lessonId=${payload.lessonId}`,
      `score=${payload.score}`,
      `timestamp=${payload.timestamp}`,
    );

    return this.learningService.forwardLessonCompleted(payload);
  }
}
