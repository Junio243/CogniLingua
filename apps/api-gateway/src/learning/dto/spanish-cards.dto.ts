import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SpanishCardsDto {
  @ApiProperty({ description: 'Identificador único do aluno' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Conceito de espanhol para gerar flashcards' })
  @IsString()
  conceptId: string;

  @ApiPropertyOptional({ description: 'Quantidade máxima de cards a retornar', minimum: 1, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
