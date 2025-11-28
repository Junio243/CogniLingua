import { loadStudentProfilerEnv } from './env-loader';

export type CognitiveLoadLevel = 'low' | 'medium' | 'high';

export interface CognitiveLoadResult {
  score: number;
  level: CognitiveLoadLevel;
  thresholds: {
    lowMax: number;
    mediumMax: number;
  };
}

function parseThreshold(raw: string | undefined, fallback: number): number {
  const value = raw !== undefined ? Number(raw) : fallback;
  return Number.isFinite(value) && value > 0 && value < 1 ? value : fallback;
}

/**
 * Calcula um score determinístico de carga cognitiva para um aluno e classifica
 * em low/medium/high. Os limites são carregados do arquivo .env do projeto e
 * podem ser ajustados sem alterar código.
 */
export function calculateCognitiveLoad(studentId: string): CognitiveLoadResult {
  if (!studentId || studentId.trim() === '') {
    throw new Error('studentId is required to calculate cognitive load');
  }

  loadStudentProfilerEnv();

  const lowMax = parseThreshold(process.env.COGNITIVE_LOAD_LOW_MAX, 0.33);
  const mediumMax = parseThreshold(process.env.COGNITIVE_LOAD_MEDIUM_MAX, 0.66);

  // Score determinístico baseado no hash simples do studentId.
  const sanitizedId = studentId.trim();
  const accumulator = sanitizedId
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const score = Number(((accumulator % 101) / 100).toFixed(2));

  let level: CognitiveLoadLevel;
  if (score <= lowMax) {
    level = 'low';
  } else if (score <= mediumMax) {
    level = 'medium';
  } else {
    level = 'high';
  }

  return {
    score,
    level,
    thresholds: { lowMax, mediumMax },
  };
}
