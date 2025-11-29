import { Neo4jService, ConceptNode } from '../neo4j/neo4j.service';
import { StudentProfilerService } from '../student-profiler/student-profiler.service';
import { CurriculumNextResponse, CurriculumSignal } from '@cognilingua/shared';
import { HistoryAlignment, SemanticAlignmentService } from './semantic-alignment.service';
export interface CurriculumConcept extends ConceptNode {
    mastery: number;
    readinessScore: number;
}
export interface RemediationLessonStep {
    title: string;
    intent: string;
    payload: Record<string, unknown>;
}
export interface RemediationLesson {
    conceptId: string;
    proficiencyGap: number;
    targetMastery: number;
    steps: RemediationLessonStep[];
    semanticEvidence: HistoryAlignment[];
}
export declare class CurriculumService {
    private readonly neo4jService;
    private readonly studentProfilerService;
    private readonly semanticAlignmentService;
    constructor(neo4jService: Neo4jService, studentProfilerService: StudentProfilerService, semanticAlignmentService: SemanticAlignmentService);
    getPersonalizedCurriculum(studentId: string): Promise<CurriculumConcept[]>;
    private buildMasteryMap;
    private getConceptReadiness;
    private getPrerequisiteMastery;
    generateRemediationLesson(conceptId: string, proficiencyGap: number, studentId?: string): Promise<RemediationLesson>;
    buildNextConceptFromSignal(signal: CurriculumSignal): Promise<CurriculumNextResponse>;
}
