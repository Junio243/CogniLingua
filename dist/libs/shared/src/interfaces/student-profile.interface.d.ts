export interface StudentProfile {
    studentId: string;
    cognitiveState: CognitiveStateEntry[];
    overallProficiency?: number;
    learningVelocity?: number;
    interactionHistory: InteractionEvent[];
    fsrsParams: FSRSParameters;
}
export interface CognitiveStateEntry {
    conceptId: string;
    mastery: number;
    bktState?: BKTState;
    fsrsState?: FSRSState;
    lastInteraction?: Date;
    confidence?: number;
}
export interface BKTState {
    pLo: number;
    pG: number;
    pS: number;
    pT: number;
    pKnown: number;
}
export interface FSRSState {
    stability: number;
    difficulty: number;
    elapsedDays: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
    state: 'Learning' | 'Review' | 'Relearning' | 'Recall';
}
export interface FSRSParameters {
    requestRetention: number;
    maximumInterval: number;
    w: number[];
}
export interface InteractionEvent {
    id: string;
    timestamp: Date;
    conceptId: string;
    type: 'lesson_start' | 'lesson_complete' | 'practice_attempt' | 'quiz_response' | 'review';
    details: any;
    outcome: 'success' | 'failure' | 'partial' | 'neutral';
}
