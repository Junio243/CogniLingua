export type Module = {
  id: string;
  title: string;
  prerequisites?: string[];
  objectives?: string[];
  completionCriteria?: {
    minAccuracy?: number;
    minExercises?: number;
    minVocabulary?: number;
  };
};

export type Lesson = {
  id: string;
  moduleId?: string;
  title: string;
  description?: string;
  durationMinutes?: number;
};

export type Flashcard = {
  front: string;
  back: string;
};

export interface LessonCompletedEvent {
  studentId: string;
  lessonId: string;
  score: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
