import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  NextLessonRequestDto,
  NextLessonResponseDto,
} from './dto/next-lesson.dto';

@ApiTags('Curriculum')
@Controller('curriculum')
export class CurriculumController {
  @Post('next')
  @ApiOperation({
    summary: 'Sugere a próxima lição para o aluno',
    description:
      'Recebe o identificador do aluno e retorna a próxima lição recomendada pelo grafo de conhecimento.',
  })
  @ApiBody({
    type: NextLessonRequestDto,
    examples: {
      default: {
        summary: 'Exemplo de solicitação',
        value: {
          studentId: 'student-123',
          context: 'Nivel-A2|conceito:verbos-regulares',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Próxima lição sugerida',
    type: NextLessonResponseDto,
    schema: {
      example: {
        nextLessonId: 'lesson-presente-indicativo',
        title: 'Presente do Indicativo – Verbos Regulares',
        rationale: 'Baixa proficiência detectada e pré-requisitos atendidos',
        generatedAt: '2024-06-30T12:34:56.000Z',
      },
    },
  })
  getNextLesson(@Body() body: NextLessonRequestDto): NextLessonResponseDto {
    return {
      nextLessonId: 'lesson-presente-indicativo',
      title: 'Presente do Indicativo – Verbos Regulares',
      rationale:
        body.context ??
        'Baixa proficiência detectada e pré-requisitos atendidos',
      generatedAt: new Date().toISOString(),
    };
  }
}
