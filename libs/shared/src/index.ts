export interface BKTState {
  pLo: number;
  pG: number;
  pS: number;
  pT: number;
  pKnown: number;
}

export interface CognitiveState {
  conceptId: string;
  mastery: number;
  difficulty: number;
  lastInteraction: string;
}

export interface StudentProfile {
  studentId: string;
  cognitiveState: CognitiveState[];
}
