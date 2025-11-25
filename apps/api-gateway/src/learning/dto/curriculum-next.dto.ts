import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CurriculumNextDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  currentConceptId?: string;

  @IsOptional()
  @IsNumber()
  mastery?: number;
}
