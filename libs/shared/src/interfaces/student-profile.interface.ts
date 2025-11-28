export interface StudentProfile {
  studentId: string;
  cognitiveState: CognitiveStateEntry[];
  overallProficiency?: number;
  learningVelocity?: number;
  interactionHistory: InteractionEvent[];
  fsrsParams: FSRSParameters; // Parameters for Spaced Repetition
}

export interface CognitiveStateEntry {
  conceptId: string;
  mastery: number;
  bktState?: BKTState; // Bayesian Knowledge Tracing state for this concept
  fsrsState?: FSRSState; // FSRS state for this concept's flashcard
  lastInteraction?: Date;
  confidence?: number; // 0-1 scale
}

export interface BKTState {
  pLo: number; // Probability of Learning (p(L))
  pG: number; // Probability of Guess (p(G))
  pS: number; // Probability of Slip (p(S))
  pT: number; // Probability of Transit (p(T))
  pKnown: number; // Current estimated probability of knowing the concept
}

export interface FSRSState {
  stability: number; // FSRS Stability parameter
  difficulty: number; // FSRS Difficulty parameter
  elapsedDays: number; // Days since last review
  scheduledDays: number; // Days until next review
  reps: number; // Number of reviews
  lapses: number; // Number of times forgotten
  state: 'Learning' | 'Review' | 'Relearning' | 'Recall';
}

export interface FSRSParameters {
  requestRetention: number; // e.g., 0.9
  maximumInterval: number; // e.g., 36500 days
  w: number[]; // FSRS global weights (w1, w2, ...)
}

export interface InteractionEvent {
  id: string;
  timestamp: Date;
  conceptId: string;
  type: 'lesson_start' | 'lesson_complete' | 'practice_attempt' | 'quiz_response' | 'review';
  details: any; // Context-specific data
  outcome: 'success' | 'failure' | 'partial' | 'neutral';
}
