import * as fs from 'fs';
import * as path from 'path';

const STUDENT_PROFILER_ENV_PATH = path.resolve(__dirname, '../.env');

/**
 * Carrega variáveis do arquivo .env localizado em apps/student-profiler/.env
 * caso ainda não estejam presentes no process.env. A abordagem evita
 * dependências externas e mantém os valores disponíveis durante testes.
 */
export function loadStudentProfilerEnv(): void {
  if (!fs.existsSync(STUDENT_PROFILER_ENV_PATH)) {
    return;
  }

  const content = fs.readFileSync(STUDENT_PROFILER_ENV_PATH, 'utf-8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/i);
    if (match) {
      const [, key, value] = match;
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  });
}
