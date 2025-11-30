import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class LessonCompletedWebhookDto {
  @ApiProperty({ description: 'Identificador único do aluno', example: 'student-123' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Identificador da lição concluída', example: 'lesson-presente-indicativo' })
  @IsString()
  lessonId: string;

  @ApiProperty({ description: 'Score bruto da tentativa (0-1)', example: 0.92, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  score: number;

  @ApiProperty({ description: 'Timestamp ISO8601 do evento', example: '2024-06-30T12:00:00.000Z' })
  @IsISO8601()
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Metadados adicionais enviados pelo cliente',
    example: { source: 'mobile-app', durationSeconds: 600 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Identificador de correlação propagado pelo cliente' })
  @IsOptional()
  @IsString()
  correlationId?: string;
}
