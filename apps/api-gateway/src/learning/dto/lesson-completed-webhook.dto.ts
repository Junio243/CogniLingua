import {
  IsString,
  IsNumber,
  IsISO8601,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LessonCompletedWebhookDto {
  @ApiProperty({ description: 'Identificador único do aluno', example: 'student-123' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Identificador da lição concluída', example: 'lesson-presente-indicativo' })
  @IsString()
  lessonId: string;

  @ApiProperty({ description: 'Score bruto da tentativa', example: 0.92 })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'Timestamp ISO8601 do evento', example: '2024-06-30T12:00:00.000Z' })
  @IsISO8601()
  timestamp: string;

  @ApiProperty({
    description: 'Metadados adicionais enviados pelo cliente',
    example: { source: 'mobile-app', durationSeconds: 600 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
