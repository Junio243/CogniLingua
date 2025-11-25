import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurriculumNextDto } from './dto/curriculum-next.dto';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import { SpanishCardsDto } from './dto/spanish-cards.dto';

@Controller('learning')
export class LearningController {
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
    @Body()
    payload: LessonCompletedWebhookDto,
  ): Promise<{ message: string; processedAt: string }> {
    return {
      message: 'Lesson completion recebida e processada (stub).',
      processedAt: new Date().toISOString(),
    };
  }

  @Post('curriculum/next')
  async getNextCurriculumStep(
    @Body() payload: CurriculumNextDto,
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
    @Body() payload: SpanishCardsDto,
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
