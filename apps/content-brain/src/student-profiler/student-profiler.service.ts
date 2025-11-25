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
    };
  }
}
