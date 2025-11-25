import { Neo4jService, ConceptNode } from '../neo4j/neo4j.service';
import { StudentProfilerService } from '../student-profiler/student-profiler.service';
export interface CurriculumConcept extends ConceptNode {
    mastery: number;
    readinessScore: number;
}
export declare class CurriculumService {
    private readonly neo4jService;
    private readonly studentProfilerService;
    constructor(neo4jService: Neo4jService, studentProfilerService: StudentProfilerService);
    getPersonalizedCurriculum(studentId: string): Promise<CurriculumConcept[]>;
    private buildMasteryMap;
    private getConceptReadiness;
    private getPrerequisiteMastery;
}
