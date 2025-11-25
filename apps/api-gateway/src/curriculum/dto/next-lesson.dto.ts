import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NextLessonRequestDto {
  @ApiProperty({
    description: 'Identificador único do aluno para cálculo do próximo passo',
    example: 'student-123',
  })
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Contexto adicional para customizar a sugestão (nível, idioma, foco)',
    example: 'Nivel-A2|conceito:verbos-regulares',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}

export class NextLessonResponseDto {
  @ApiProperty({
    description: 'ID do conceito ou lição sugerida',
    example: 'lesson-presente-indicativo',
  })
  nextLessonId: string;

  @ApiProperty({
    description: 'Título amigável da lição sugerida',
    example: 'Presente do Indicativo – Verbos Regulares',
  })
  title: string;

  @ApiProperty({
    description: 'Explicação curta de por que a lição foi escolhida',
    example: 'Baixa proficiência detectada e pré-requisitos atendidos',
  })
  rationale: string;

  @ApiProperty({
    description: 'Timestamp de quando a recomendação foi gerada',
    example: '2024-06-30T12:34:56.000Z',
  })
  generatedAt: string;
}
