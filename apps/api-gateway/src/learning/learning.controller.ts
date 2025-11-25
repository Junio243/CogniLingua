import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';

@ApiTags('Learning')
@Controller('learning')
export class LearningController {
  // 👉 Endpoint acessável pelo navegador (GET)
  @Get('status')
  @ApiOperation({ summary: 'Health-check do gateway' })
  @ApiOkResponse({
    description: 'Retorna status básico do gateway',
    schema: {
      example: {
        ok: true,
        message: 'API Gateway está rodando 👌',
        timestamp: '2024-06-30T12:34:56.000Z',
      },
    },
  })
  getStatus() {
    return {
      ok: true,
      message: 'API Gateway está rodando 👌',
      timestamp: new Date().toISOString(),
    };
  }

  // 👉 Endpoint usado pelo webhook (POST)
  @Post('lesson-completed')
  @ApiOperation({
    summary: 'Webhook de conclusão de lição',
    description:
      'Recebe eventos de lições concluídas e repassa ao orquestrador (stub).',
  })
  @ApiBody({
    type: LessonCompletedWebhookDto,
    examples: {
      default: {
        summary: 'Evento de conclusão',
        value: {
          studentId: 'student-123',
          lessonId: 'lesson-presente-indicativo',
          score: 0.92,
          timestamp: '2024-06-30T12:00:00.000Z',
          metadata: { source: 'mobile-app', durationSeconds: 600 },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Confirmação de recebimento do webhook',
    schema: {
      example: {
        success: true,
        message: 'Lesson completion recebida e processada (stub).',
      },
    },
  })
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
