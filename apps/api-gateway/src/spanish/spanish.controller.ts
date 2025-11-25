import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FlashcardDto,
  SpanishCardsRequestDto,
  SpanishCardsResponseDto,
} from './dto/spanish-cards.dto';

@ApiTags('Spanish')
@Controller('spanish')
export class SpanishController {
  @Post('cards')
  @ApiOperation({
    summary: 'Retorna flashcards de espanhol personalizados',
    description:
      'Gera um baralho de cartões (frente e verso) de acordo com o perfil do aluno e tópico selecionado.',
  })
  @ApiBody({
    type: SpanishCardsRequestDto,
    examples: {
      default: {
        summary: 'Solicitação com tópico',
        value: {
          studentId: 'student-123',
          topic: 'verbos no presente',
        },
      },
      semTopico: {
        summary: 'Solicitação sem tópico (usa gaps do aluno)',
        value: {
          studentId: 'student-123',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Baralho de flashcards sugerido',
    type: SpanishCardsResponseDto,
    schema: {
      example: {
        cards: [
          { front: '¿Cómo estás?', back: 'How are you?', difficulty: 'A1' },
          { front: 'Yo hablo', back: 'I speak', difficulty: 'A1' },
        ] as FlashcardDto[],
        deckVersion: 'deck-v1.4.0',
      },
    },
  })
  getCards(@Body() body: SpanishCardsRequestDto): SpanishCardsResponseDto {
    const topicSlug = body.topic?.replace(/\s+/g, '-').toLowerCase();

    return {
      cards: [
        { front: '¿Cómo estás?', back: 'How are you?', difficulty: 'A1' },
        { front: 'Yo hablo', back: 'I speak', difficulty: 'A1' },
      ],
      deckVersion: topicSlug ? `deck-${topicSlug}-v1.0.0` : 'deck-v1.4.0',
    };
  }
}
