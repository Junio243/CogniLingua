import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class NextItemRequestDto {
  @ApiProperty({ description: 'Identificador único do aluno' })
  @IsString()
  studentId: string;

  @ApiPropertyOptional({ description: 'Módulo atual que está sendo cursado' })
  @IsOptional()
  @IsString()
  moduleId?: string;

  @ApiPropertyOptional({
    description: 'Itens já concluídos para evitar repetição',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedItemIds?: string[];

  @ApiPropertyOptional({ description: 'Acurácia recente (0-1)', minimum: 0, maximum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  accuracyPercent?: number;

  @ApiPropertyOptional({
    description: 'Quantidade de exercícios concluídos na sessão',
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(500)
  exercisesCompleted?: number;
}
