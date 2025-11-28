import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { InteractionEvent, StudentProfile } from '@cognilingua/shared';

type EmbeddingBackend = 'python' | 'rust' | 'fallback';

export interface SentenceEmbedding {
  sentence: string;
  vector: number[];
}

export interface HistoryAlignment {
  conceptId: string;
  eventId: string;
  similarity: number;
  evidence: string;
  backend: EmbeddingBackend;
}

interface EmbeddingResponse {
  backend: EmbeddingBackend;
  embeddings: SentenceEmbedding[];
}

@Injectable()
export class SemanticAlignmentService {
  private readonly logger = new Logger(SemanticAlignmentService.name);
  private readonly pythonEntrypoint =
    process.env.SENTENCE_EMBEDDING_PY ||
    path.join(process.cwd(), 'scripts', 'embedding_bridge.py');
  private readonly rustEntrypoint =
    process.env.SENTENCE_EMBEDDING_RS ||
    path.join(process.cwd(), 'target', 'debug', 'sentence_embedding');

  async alignHistoryWithConcepts(
    profile: StudentProfile | null,
    conceptSentences: Record<string, string[]>,
  ): Promise<HistoryAlignment[]> {
    const history = this.buildHistorySentences(profile);
    const references = this.buildReferenceSentences(conceptSentences);

    const allSentences = [
      ...history.map((entry) => entry.sentence),
      ...references.map((entry) => entry.sentence),
    ];

    const embeddingResponse = await this.embedSentences(allSentences);
    const sentenceToVector = new Map(
      embeddingResponse.embeddings.map((item) => [item.sentence, item.vector]),
    );

    const alignments: HistoryAlignment[] = [];
    for (const historyEntry of history) {
      const historyVector = sentenceToVector.get(historyEntry.sentence);
      if (!historyVector) continue;

      for (const reference of references) {
        const referenceVector = sentenceToVector.get(reference.sentence);
        if (!referenceVector) continue;

        const similarity = this.cosineSimilarity(historyVector, referenceVector);
        alignments.push({
          conceptId: reference.conceptId,
          eventId: historyEntry.event.id,
          similarity,
          evidence: historyEntry.sentence,
          backend: embeddingResponse.backend,
        });
      }
    }

    return alignments.sort((a, b) => b.similarity - a.similarity);
  }

  private buildHistorySentences(profile: StudentProfile | null): {
    event: InteractionEvent;
    sentence: string;
  }[] {
    const events = profile?.interactionHistory ?? [];
    return events.map((event) => ({
      event,
      sentence: this.describeInteraction(event),
    }));
  }

  private buildReferenceSentences(
    conceptSentences: Record<string, string[]>,
  ): { conceptId: string; sentence: string }[] {
    const entries: { conceptId: string; sentence: string }[] = [];
    for (const [conceptId, sentences] of Object.entries(conceptSentences)) {
      for (const sentence of sentences) {
        entries.push({ conceptId, sentence });
      }
    }
    return entries;
  }

  private describeInteraction(event: InteractionEvent): string {
    const detailSummary = typeof event.details === 'object'
      ? JSON.stringify(event.details)
      : String(event.details ?? '');

    return [
      `interaction ${event.type}`,
      `concept ${event.conceptId}`,
      `outcome ${event.outcome}`,
      `details ${detailSummary}`,
    ].join(' | ');
  }

  private async embedSentences(sentences: string[]): Promise<EmbeddingResponse> {
    const pythonAttempt = await this.tryFfiEmbedding(
      'python',
      this.pythonEntrypoint,
      ['python3', this.pythonEntrypoint, '--json'],
      sentences,
    );
    if (pythonAttempt) {
      return pythonAttempt;
    }

    const rustAttempt = await this.tryFfiEmbedding(
      'rust',
      this.rustEntrypoint,
      [this.rustEntrypoint],
      sentences,
    );
    if (rustAttempt) {
      return rustAttempt;
    }

    return {
      backend: 'fallback',
      embeddings: this.computeFallbackEmbeddings(sentences),
    };
  }

  private async tryFfiEmbedding(
    backend: Exclude<EmbeddingBackend, 'fallback'>,
    entrypoint: string,
    commandWithArgs: string[],
    sentences: string[],
  ): Promise<EmbeddingResponse | null> {
    if (!entrypoint || !fs.existsSync(entrypoint)) {
      return null;
    }

    try {
      const [command, ...args] = commandWithArgs;
      if (!command) {
        return null;
      }
      const response = await this.runProcess(command, args, sentences);
      if (!Array.isArray(response)) return null;

      const embeddings: SentenceEmbedding[] = response
        .filter((item) => typeof item?.sentence === 'string')
        .map((item) => ({
          sentence: item.sentence,
          vector: Array.isArray(item.vector)
            ? item.vector.map((value) => Number(value))
            : [],
        }));

      if (!embeddings.length) return null;

      return { backend, embeddings };
    } catch (error) {
      this.logger.warn(
        `Embedding FFI backend ${backend} failed, falling back`,
        error instanceof Error ? error.message : String(error),
      );
      return null;
    }
  }

  private runProcess(
    command: string,
    args: string[],
    sentences: string[],
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (err) => reject(err));

      child.on('close', (code) => {
        if (code !== 0) {
          return reject(
            new Error(`FFI process exited with code ${code}: ${stderr}`),
          );
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (err) {
          reject(new Error(`Failed to parse FFI output: ${err}`));
        }
      });

      child.stdin.write(JSON.stringify({ sentences }));
      child.stdin.end();
    });
  }

  private computeFallbackEmbeddings(sentences: string[]): SentenceEmbedding[] {
    return sentences.map((sentence) => ({
      sentence,
      vector: this.simpleHashEmbedding(sentence),
    }));
  }

  private simpleHashEmbedding(sentence: string): number[] {
    const sanitized = sentence.normalize('NFKD');
    const vector = Array.from({ length: 12 }, (_, idx) => {
      const char = sanitized.charCodeAt(idx % sanitized.length) || 0;
      return (Math.sin(char + idx) + 1) / 2;
    });

    const norm = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
    return norm === 0 ? vector : vector.map((value) => value / norm);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const length = Math.min(a.length, b.length);
    if (length === 0) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dot / denominator;
  }
}
