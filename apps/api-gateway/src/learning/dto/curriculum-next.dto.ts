import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CurriculumNextDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  currentConceptId?: string;

  @IsOptional()
  @IsNumber()
  mastery?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  cognitiveLoadOverride?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  accuracyPercent?: number;

  @IsOptional()
  @IsNumber()
  exercisesCompleted?: number;

  @IsOptional()
  @IsString()
  correlationId?: string;

  @IsOptional()
  @IsNumber()
  eventTimestamp?: number;
}
