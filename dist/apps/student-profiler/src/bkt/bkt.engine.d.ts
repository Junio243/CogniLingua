import { BKTState } from '@cognilingua/shared';
export declare class BKTEngine {
    private readonly logger;
    updateKnowledgeState(currentState: BKTState, correct: boolean): BKTState;
    initializeState(pLo: number, pG: number, pS: number, pT: number): BKTState;
}
