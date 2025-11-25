export interface ConceptNode {
    id: string;
    title: string;
    difficulty: number;
}
export declare class Neo4jService {
    private readonly logger;
    private driver;
    constructor();
    private getSession;
    getAllConcepts(): Promise<ConceptNode[]>;
    getPrerequisiteConceptIds(conceptId: string): Promise<string[]>;
    onModuleDestroy(): Promise<void>;
}
