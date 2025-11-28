import { Injectable } from '@nestjs/common';
import { StudentProfile } from '@cognilingua/shared';

@Injectable()
export class StudentProfilerService {
  /**
   * Stub temporário.
   * Depois você troca pela chamada gRPC real ao microsserviço student-profiler.
  */
  async getStudentProfile(studentId: string): Promise<StudentProfile> {
    return {
      studentId,
      cognitiveState: [],
      overallProficiency: 0,
      learningVelocity: 0,
      interactionHistory: [],
      fsrsParams: {
        requestRetention: 0.9,
        maximumInterval: 36500,
        w: [],
      },
    };
  }
}
