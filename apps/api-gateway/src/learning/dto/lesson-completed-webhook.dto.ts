import { IsString, IsNumber, IsISO8601, IsOptional, IsObject } from 'class-validator';

export class LessonCompletedWebhookDto {
  @IsString()
  studentId: string;

  @IsString()
  lessonId: string;

  @IsNumber()
  score: number;

  @IsISO8601()
  timestamp: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
