import { Body, Controller, Get, Headers, Post, Req, ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { Request } from 'express';

type AuthRequest = Request & { user?: any };

@ApiTags('Learning')
@ApiBearerAuth()
@Controller('learning')
export class LearningController {
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

  @Get('modules')
  @ApiOperation({ summary: 'Lista módulos personalizados pelo content-brain' })
  async listModules(@Req() req: AuthRequest, @Headers('x-correlation-id') correlationId?: string) {
    const studentId = req.user?.sub || req.user?.id || 'anonymous';
    return this.learningService.fetchModules(studentId, correlationId);
  }

  @Post('next-item')
  @ApiOperation({ summary: 'Solicita próximo item de estudo ao content-brain' })
  @ApiOkResponse({ description: 'Contrato de próximo item retornado pelo content-brain' })
  getNextItem(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    payload: NextItemRequestDto,
    @Req() req: AuthRequest,
    @Headers('x-correlation-id') correlationId?: string,
  ) {
    const studentId = req.user?.sub || payload.studentId;
    return this.learningService.fetchNextItem({ ...payload, studentId }, correlationId);
  }

  @Post('lesson-completed')
  @ApiOperation({
    summary: 'Webhook de conclusão de lição',
    description: 'Encaminha eventos para student-profiler e persiste telemetria.',
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
        message: 'Lesson completion recebida e processada.',
        processedAt: '2024-06-30T12:00:00.000Z',
        correlationId: 'corr-123',
      },
    },
  })
  async handleLessonCompletedWebhook(
    @Body(new ValidationPipe({ transform: true }))
    payload: LessonCompletedWebhookDto,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<{ success: boolean; message: string; processedAt: string; correlationId: string }> {
    const response = await this.learningService.processLessonCompleted(payload, correlationId);

    return {
      ...response,
      processedAt: new Date().toISOString(),
    };
  }

  @Post('curriculum/next')
  @ApiOperation({ summary: 'Solicita próximo passo do currículo ao content-brain' })
  async getNextCurriculumStep(
    @Body(new ValidationPipe({ transform: true }))
    payload: CurriculumNextDto,
    @Req() req: AuthRequest,
  ): Promise<CurriculumNextResponse> {
    const studentId = req.user?.sub || payload.studentId;
    return this.learningService.forwardCurriculumRequest({ ...payload, studentId });
  }

  @Post('spanish/cards')
  @ApiOperation({ summary: 'Solicita flashcards para um conceito de espanhol' })
  async getSpanishCards(
    @Body(new ValidationPipe({ transform: true }))
    payload: SpanishCardsDto,
    @Req() req: AuthRequest,
    @Headers('x-correlation-id') correlationId?: string,
  ): Promise<{ conceptId: string; cards: Array<{ front: string; back: string }> }> {
    const studentId = req.user?.sub || payload.studentId;
    return this.learningService.fetchSpanishCards({ ...payload, studentId }, correlationId);
  }
}
