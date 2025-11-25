import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class NextItemRequestDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedItemIds?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  accuracyPercent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  exercisesCompleted?: number;
}
