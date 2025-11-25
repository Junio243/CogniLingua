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
import { NextItemRequestDto } from './dto/next-item-request.dto'; // Importa DTO da primeira versão
import { SpanishCardsDto } from './dto/spanish-cards.dto'; // Importa DTO da segunda versão
// O LearningService não é mais injetado, pois sua lógica foi movida ou substituída
// import { LearningService } from './learning.service';

@ApiTags('Learning')
@Controller('learning')
export class LearningController {
  // O construtor foi removido, pois LearningService não é mais usado aqui
  // constructor(private readonly learningService: LearningService) {}

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
    const { studentId, completedVocabulary, accuracy, exercisesCompleted } = payload;
    // Simula decisão baseada no payload
    const nextVocabularyItem = `vocab-item-${Date.now()}`; // Lógica real em outro serviço
    const progress = {
      currentAccuracy: accuracy,
      exercisesCompleted,
      vocabularyMastered: completedVocabulary.length,
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
      },
    },
  })
  async handleLessonCompletedWebhook(
    @Body(new ValidationPipe({ transform: true }))
    payload: LessonCompletedWebhookDto,
  ): Promise<{ message: string; processedAt: string }> {
    // Aqui, o controlador deve chamar o microsserviço student-profiler via gRPC
    // Exemplo (stub):
    console.log('Recebido webhook:', payload);
    // clientGrpcStudentProfiler.recalculateMetrics(payload); // Chamada real via gRPC

    return {
      message: 'Lesson completion recebida e processada (stub).',
      processedAt: new Date().toISOString(),
    };
  }

  // Endpoint da segunda versão para obter o próximo conteúdo do currículo
  @Post('curriculum/next')
  async getNextCurriculumStep(
    @Body(new ValidationPipe({ transform: true }))
    payload: CurriculumNextDto,
  ): Promise<{ nextConceptId: string; rationale: string }> {
    // A lógica real deve estar no microsserviço content-brain e ser chamada via gRPC
    // Exemplo (stub):
    const nextConceptId = payload.currentConceptId
      ? `${payload.currentConceptId}-next`
      : 'concept-0001';

    return {
      nextConceptId,
      rationale: 'Recomendação baseada em progresso recente (stub).',
    };
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