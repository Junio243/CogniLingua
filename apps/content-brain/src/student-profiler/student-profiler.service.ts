import { Injectable, Logger } from '@nestjs/common';
import { StudentProfile } from '@cognilingua/shared';

@Injectable()
export class StudentProfilerService {
  private readonly logger = new Logger(StudentProfilerService.name);

  /**
   * Stub temporário.
   * Depois você troca pela chamada gRPC real ao microsserviço student-profiler.
  */
  async getStudentProfile(studentId: string): Promise<StudentProfile | null> {
    try {
      const now = new Date();

      const profile: StudentProfile = {
        studentId,
        cognitiveState: [
          {
            conceptId: 'initial-assessment',
            mastery: 0,
            bktState: {
              pLo: 0.2,
              pG: 0.2,
              pS: 0.1,
              pT: 0.3,
              pKnown: 0.2,
            },
            fsrsState: {
              stability: 0,
              difficulty: 0,
              elapsedDays: 0,
              scheduledDays: 0,
              reps: 0,
              lapses: 0,
              state: 'Learning',
            },
            lastInteraction: now,
            confidence: 0.5,
          },
        ],
        overallProficiency: 0,
        learningVelocity: 0,
        interactionHistory: [
          {
            id: `${studentId}-initial`,
            timestamp: now,
            conceptId: 'initial-assessment',
            type: 'lesson_start',
            details: {},
            outcome: 'neutral',
          },
        ],
        fsrsParams: {
          requestRetention: 0.9,
          maximumInterval: 36500,
          w: [],
        },
      };

      return this.serializeForJson(profile);
    } catch (error) {
      this.logger.error(
        `Failed to fetch student profile for ${studentId}`,
        error instanceof Error ? error.stack : `${error}`,
      );

      return null;
    }
  }

  private serializeForJson(profile: StudentProfile): StudentProfile {
    const interactionHistory = (profile.interactionHistory ?? []).map((event) => ({
      ...event,
      id: event.id ?? `${profile.studentId}-${event.conceptId}-${Date.now()}`,
      timestamp: this.toDate(event.timestamp ?? new Date()),
      details: event.details ?? {},
    }));

    const cognitiveState = (profile.cognitiveState ?? []).map((entry) => ({
      ...entry,
      mastery: entry.mastery ?? 0,
      bktState:
        entry.bktState ??
        ({
          pLo: 0,
          pG: 0,
          pS: 0,
          pT: 0,
          pKnown: 0,
        } as const),
      fsrsState:
        entry.fsrsState ??
        ({
          stability: 0,
          difficulty: 0,
          elapsedDays: 0,
          scheduledDays: 0,
          reps: 0,
          lapses: 0,
          state: 'Learning',
        } as const),
      lastInteraction: entry.lastInteraction
        ? this.toDate(entry.lastInteraction)
        : undefined,
      confidence: entry.confidence ?? 0,
    }));

    return {
      studentId: profile.studentId,
      cognitiveState,
      overallProficiency: profile.overallProficiency ?? 0,
      learningVelocity: profile.learningVelocity ?? 0,
      interactionHistory,
      fsrsParams:
        profile.fsrsParams ??
        ({ requestRetention: 0.9, maximumInterval: 36500, w: [] } as const),
    };
  }

  private toDate(value: string | number | Date): Date {
    const isoString = new Date(value).toISOString();
    return new Date(isoString);
  }
}
