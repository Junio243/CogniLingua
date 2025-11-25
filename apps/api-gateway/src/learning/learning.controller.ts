import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurriculumNextDto } from './dto/curriculum-next.dto';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import { SpanishCardsDto } from './dto/spanish-cards.dto';

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
    @Body(new ValidationPipe({ transform: true }))
    payload: LessonCompletedWebhookDto,
  ): Promise<{ message: string; processedAt: string }> {
    return {
      message: 'Lesson completion recebida e processada (stub).',
      processedAt: new Date().toISOString(),
    };
  }

  @Post('curriculum/next')
  async getNextCurriculumStep(
    @Body(new ValidationPipe({ transform: true }))
    payload: CurriculumNextDto,
  ): Promise<{ nextConceptId: string; rationale: string }> {
    const nextConceptId = payload.currentConceptId
      ? `${payload.currentConceptId}-next`
      : 'concept-0001';

    return {
      nextConceptId,
      rationale: 'Recomendação baseada em progresso recente (stub).',
    };
  }

  @Post('spanish/cards')
  async getSpanishCards(
    @Body(new ValidationPipe({ transform: true }))
    payload: SpanishCardsDto,
  ): Promise<{ conceptId: string; cards: Array<{ front: string; back: string }> }> {
    const limit = payload.limit ?? 10;

    const cards = Array.from({ length: limit }).map((_, index) => ({
      front: `Carta ${index + 1} para ${payload.conceptId}`,
      back: `Tradução/explicação ${index + 1}`,
    }));

    return {
      conceptId: payload.conceptId,
      cards,
    };
  }
}