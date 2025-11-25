import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SpanishCardsRequestDto {
  @ApiProperty({
    description: 'Identificador do aluno para personalizar o baralho',
    example: 'student-123',
  })
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Tema ou tópico de interesse para filtrar as cartas',
    example: 'verbos no presente',
    required: false,
  })
  @IsOptional()
  @IsString()
  topic?: string;
}

export class FlashcardDto {
  @ApiProperty({ description: 'Face frontal da carta', example: '¿Cómo estás?' })
  front: string;

  @ApiProperty({ description: 'Face traseira com resposta ou dica', example: 'How are you?' })
  back: string;

  @ApiProperty({ description: 'Dificuldade sugerida', example: 'A2' })
  difficulty: string;
}

export class SpanishCardsResponseDto {
  @ApiProperty({
    description: 'Coleção de flashcards sugeridos',
    type: [FlashcardDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlashcardDto)
  cards: FlashcardDto[];

  @ApiProperty({
    description: 'Versão ou seed do baralho recomendado',
    example: 'deck-v1.4.0',
  })
  @IsString()
  deckVersion: string;
}
