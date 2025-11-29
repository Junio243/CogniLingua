import { CurriculumNextDto } from './dto/curriculum-next.dto';
import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
import { NextItemRequestDto } from './dto/next-item-request.dto';
import { SpanishCardsDto } from './dto/spanish-cards.dto';
import { LearningService } from './learning.service';
import { CurriculumNextResponse } from '@cognilingua/shared';
export declare class LearningController {
    private readonly learningService;
    private readonly logger;
    constructor(learningService: LearningService);
    getStatus(): {
        ok: boolean;
        message: string;
        timestamp: string;
    };
    listModules(): {
        id: string;
        title: string;
        prerequisites: string[];
        objectives: string[];
        completionCriteria: {
            minAccuracy: number;
            minExercises: number;
            minVocabulary: number;
        };
    }[];
    getNextItem(payload: NextItemRequestDto): {
        nextItem: string;
        progress: {
            currentAccuracy: number;
            exercisesCompleted: number;
            vocabularyMastered: number;
            nextSuggestedModule: string;
        };
    };
    handleLessonCompletedWebhook(payload: LessonCompletedWebhookDto): Promise<{
        success: boolean;
        message: string;
        processedAt: string;
    }>;
    getNextCurriculumStep(payload: CurriculumNextDto): Promise<CurriculumNextResponse>;
    getSpanishCards(payload: SpanishCardsDto): Promise<{
        conceptId: string;
        cards: Array<{
            front: string;
            back: string;
        }>;
    }>;
}
