import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CurriculumNextDto } from './dto/curriculum-next.dto';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import {
  CurriculumNextResponse,
  CurriculumSignal,
} from '@cognilingua/shared';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, retry, timeout, timer } from 'rxjs';
import { LessonEventEntity } from './entities/lesson-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { NextItemRequestDto } from './dto/next-item-request.dto';
import { SpanishCardsDto } from './dto/spanish-cards.dto';

interface LessonAck {
  correlationId?: string;
  status?: string;
  message?: string;
}

@Injectable()
export class LearningService {
  private readonly logger = new Logger(LearningService.name);
  private readonly studentProfilerUrl =
    process.env.STUDENT_PROFILER_URL || 'http://student-profiler:3001';
  private readonly contentBrainUrl =
    process.env.CONTENT_BRAIN_URL || 'http://content-brain:3002';
  private readonly httpTimeoutMs = Number(process.env.LEARNING_HTTP_TIMEOUT_MS ?? 5000);
  private readonly retryCount = Number(process.env.LEARNING_HTTP_RETRY_COUNT ?? 2);
  private readonly retryDelayMs = Number(process.env.LEARNING_HTTP_RETRY_DELAY_MS ?? 250);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(LessonEventEntity)
    private readonly lessonEventsRepository: Repository<LessonEventEntity>,
  ) {}

  /**
   * Compatibilidade com testes antigos. Encaminha evento de lição concluída.
   */
  async forwardLessonCompleted(
    payload: LessonCompletedWebhookDto,
    correlationId?: string,
  ): Promise<{ success: boolean; message: string; correlationId: string }> {
    const response = await this.processLessonCompleted(payload, correlationId);
    return { success: true, message: response.message, correlationId: response.correlationId };
  }

  async processLessonCompleted(
    payload: LessonCompletedWebhookDto,
    incomingCorrelationId?: string,
  ): Promise<{ success: boolean; message: string; correlationId: string }> {
    const correlationId = payload.correlationId || incomingCorrelationId || this.generateCorrelationId();
    const preparedPayload = { ...payload, correlationId };

    this.logger.log(
      { correlationId, studentId: payload.studentId, lessonId: payload.lessonId },
      '🔔 Recebendo lesson-completed para encaminhamento',
    );

    const studentProfilerResponse = await this.dispatchWithRetry<LessonAck>(
      `${this.studentProfilerUrl}/lessons/completed`,
      preparedPayload,
      correlationId,
      'student-profiler',
    );

    await this.persistLessonEvent(preparedPayload, studentProfilerResponse?.status);

    return {
      success: true,
      message:
        studentProfilerResponse?.message ||
        `Lesson ${payload.lessonId} encaminhada para student-profiler`,
      correlationId,
    };
  }

  async forwardCurriculumRequest(payload: CurriculumNextDto): Promise<CurriculumNextResponse> {
    const correlationId = payload.correlationId || this.generateCorrelationId();
    const signal: CurriculumSignal = {
      studentId: payload.studentId,
      currentConceptId: payload.currentConceptId,
      mastery: payload.mastery,
      cognitiveLoadOverride: payload.cognitiveLoadOverride,
      accuracyPercent: payload.accuracyPercent,
      exercisesCompleted: payload.exercisesCompleted,
      correlationId,
      eventTimestamp: payload.eventTimestamp ?? Date.now(),
    };

    await this.dispatchWithRetry<AckResponse>(
      `${this.studentProfilerUrl}/learning/signals`,
      signal,
      correlationId,
      'student-profiler',
    );

    const response = await this.dispatchWithRetry<CurriculumNextResponse>(
      `${this.contentBrainUrl}/curriculum/next`,
      signal,
      correlationId,
      'content-brain',
    );

    return response;
  }

  async fetchModules(studentId: string, correlationId?: string): Promise<any> {
    const corr = correlationId || this.generateCorrelationId();
    return this.dispatchWithRetry<any>(
      `${this.contentBrainUrl}/modules`,
      { studentId, correlationId: corr },
      corr,
      'content-brain',
    );
  }

  async fetchNextItem(payload: NextItemRequestDto, correlationId?: string): Promise<NextItemResponse> {
    const corr = correlationId || this.generateCorrelationId();
    return this.dispatchWithRetry<NextItemResponse>(
      `${this.contentBrainUrl}/items/next`,
      { ...payload, correlationId: corr },
      corr,
      'content-brain',
    );
  }

  async fetchSpanishCards(
    payload: SpanishCardsDto,
    correlationId?: string,
  ): Promise<{ conceptId: string; cards: Array<{ front: string; back: string }> }> {
    const corr = correlationId || this.generateCorrelationId();
    return this.dispatchWithRetry<{ conceptId: string; cards: Array<{ front: string; back: string }> }>(
      `${this.contentBrainUrl}/spanish/cards`,
      { ...payload, correlationId: corr },
      corr,
      'content-brain',
    );
  }

  private async dispatchWithRetry<T>(
    url: string,
    body: Record<string, any>,
    correlationId: string,
    target: string,
  ): Promise<T> {
    this.logger.log({ correlationId, target, url }, '🚀 Disparando requisição');
    const request$ = this.httpService
      .post<T>(url, body, {
        headers: {
          'x-correlation-id': correlationId,
        },
      })
      .pipe(
        timeout(this.httpTimeoutMs),
        retry({
          count: this.retryCount,
          delay: (_error, retryCount) => timer(this.retryDelayMs * retryCount),
        }),
        catchError((error) => {
          this.logger.error(
            { correlationId, target, url, error: error?.message },
            '❌ Falha ao comunicar com serviço dependente',
          );
          throw new BadGatewayException(
            `Falha ao comunicar com ${target}: ${error?.response?.data?.message || error?.message}`,
          );
        }),
      );

    const response = await lastValueFrom(request$);
    const data = (response as any)?.data ?? (response as any);
    return data as T;
  }

  private async persistLessonEvent(
    payload: LessonCompletedWebhookDto & { correlationId: string },
    status?: string,
  ) {
    try {
      const entity = this.lessonEventsRepository.create({
        studentId: payload.studentId,
        lessonId: payload.lessonId,
        score: payload.score,
        timestamp: payload.timestamp,
        correlationId: payload.correlationId,
        metadata: payload.metadata,
        externalStatus: status,
      });
      await this.lessonEventsRepository.save(entity);
    } catch (error) {
      this.logger.error(
        { correlationId: payload.correlationId, error: error?.message },
        '⚠️ Falha ao persistir evento de lição concluída',
      );
    }
  }

  private generateCorrelationId(): string {
    return randomUUID();
  }
}

interface AckResponse {
  status?: string;
  message?: string;
  correlationId?: string;
}

interface NextItemResponse {
  nextItem: string;
  progress: Record<string, any>;
}
