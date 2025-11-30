import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
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
import { NextItemRequestDto } from './dto/next-item-request.dto';
import { SpanishCardsDto } from './dto/spanish-cards.dto';
import { LearningService } from './learning.service';
import { CurriculumNextResponse } from '@cognilingua/shared';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Learning')
@Controller('learning')
export class LearningController {
  private readonly logger = new Logger(LearningController.name);

  constructor(private readonly learningService: LearningService) {}

  // 👉 Endpoint acessível pelo navegador (GET)
  @Public()
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

  // Endpoint da primeira versão para listar módulos
  @Get('modules')
  listModules() {
    // A lógica original do LearningService.getModules() precisa ser reimplementada ou chamada via gRPC
    // Exemplo (stub):
    return [
      {
        id: 'basico-1',
        title: 'Saudações e Apresentações',
        prerequisites: [],
        objectives: ['Cumprimentar', 'Se apresentar'],
        completionCriteria: { minAccuracy: 0.8, minExercises: 8, minVocabulary: 6 },
      },
      {
        id: 'basico-2',
        title: 'Rotina e Números',
        prerequisites: ['basico-1'],
        objectives: ['Descrever rotina', 'Falar de horários'],
        completionCriteria: { minAccuracy: 0.8, minExercises: 10, minVocabulary: 7 },
      },
      // ... outros módulos
    ];
  }

  // Endpoint da primeira versão para obter o próximo item
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
    // A lógica original do LearningService.getNextItem() precisa ser reimplementada ou chamada via gRPC
    // Exemplo (stub) - Esta lógica deve ser movida para o microsserviço adequado e chamada via gRPC
    const { completedItemIds, accuracyPercent, exercisesCompleted } = payload;
    // Simula decisão baseada no payload
    const nextVocabularyItem = `vocab-item-${Date.now()}`; // Lógica real em outro serviço
    const vocabularyMastered = Array.isArray(completedItemIds)
      ? completedItemIds.length
      : 0;
    const progress = {
      currentAccuracy: accuracyPercent ?? null,
      exercisesCompleted: exercisesCompleted ?? 0,
      vocabularyMastered,
      nextSuggestedModule: 'basico-2', // Lógica real em outro serviço
    };

    return {
      nextItem: nextVocabularyItem,
      progress,
    };
  }

  // 👉 Endpoint usado pelo webhook (POST) - Da segunda versão
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
        processedAt: '2024-06-30T12:00:00.000Z',
      },
    },
  })
  async handleLessonCompletedWebhook(
    @Body(new ValidationPipe({ transform: true }))
    payload: LessonCompletedWebhookDto,
  ): Promise<{ success: boolean; message: string; processedAt: string }> {
    this.logger.log(
      {
        studentId: payload.studentId,
        lessonId: payload.lessonId,
        score: payload.score,
        timestamp: payload.timestamp,
      },
      '✅ Lesson completed webhook recebido',
    );

    const response = await this.learningService.forwardLessonCompleted(payload);

    return {
      ...response,
      processedAt: new Date().toISOString(),
    };
  }

  // Endpoint da segunda versão para obter o próximo conteúdo do currículo
  @Post('curriculum/next')
  async getNextCurriculumStep(
    @Body(new ValidationPipe({ transform: true }))
    payload: CurriculumNextDto,
  ): Promise<CurriculumNextResponse> {
    return this.learningService.forwardCurriculumRequest(payload);
  }

  // Endpoint da segunda versão para obter flashcards de espanhol
  @Post('spanish/cards')
  async getSpanishCards(
    @Body(new ValidationPipe({ transform: true }))
    payload: SpanishCardsDto,
  ): Promise<{ conceptId: string; cards: Array<{ front: string; back: string }> }> {
    // A lógica real deve estar no microsserviço content-brain e ser chamada via gRPC
    // Exemplo (stub):
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