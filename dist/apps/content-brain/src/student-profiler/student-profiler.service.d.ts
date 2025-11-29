import { StudentProfile } from '@cognilingua/shared';
export declare class StudentProfilerService {
    private readonly logger;
    getStudentProfile(studentId: string): Promise<StudentProfile | null>;
    private serializeForJson;
    private toDate;
}
