import { LessonCompletedWebhookDto } from './dto/lesson-completed-webhook.dto';
export declare class LearningController {
    getStatus(): {
        ok: boolean;
        message: string;
        timestamp: string;
    };
    handleLessonCompletedWebhook(payload: LessonCompletedWebhookDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
