import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import { NextItemRequestDto } from './dto/next-item-request.dto';
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

  @Get('modules')
  listModules() {
    return this.learningService.getModules();
  }

  @Post('next-item')
  getNextItem(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    payload: NextItemRequestDto,
  ) {
    return this.learningService.getNextItem(payload);
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

    return {
      success: true,
      message: 'Lesson completion recebida e processada (stub).',
    };
  }
}
