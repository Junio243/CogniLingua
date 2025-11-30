import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CurriculumNextDto {
  @ApiProperty({ description: 'Identificador único do aluno' })
  @IsString()
  studentId: string;

  @ApiPropertyOptional({ description: 'Conceito atual dentro do fluxo do currículo' })
  @IsOptional()
  @IsString()
  currentConceptId?: string;

  @ApiPropertyOptional({ description: 'Mastery atual estimado (0-1)', minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  mastery?: number;

  @ApiPropertyOptional({
    description: 'Sobrescrita manual da carga cognitiva (0-1) enviada ao orquestrador',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  cognitiveLoadOverride?: number;

  @ApiPropertyOptional({ description: 'Acurácia recente (0-1)', minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  accuracyPercent?: number;

  @ApiPropertyOptional({ description: 'Quantidade de exercícios resolvidos no contexto atual', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  exercisesCompleted?: number;

  @ApiPropertyOptional({ description: 'Identificador de correlação para tracing distribuído' })
  @IsOptional()
  @IsString()
  correlationId?: string;

  @ApiPropertyOptional({ description: 'Timestamp do evento em epoch millis', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  eventTimestamp?: number;
}
