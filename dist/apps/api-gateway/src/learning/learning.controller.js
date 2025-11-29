"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LearningController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const curriculum_next_dto_1 = require("./dto/curriculum-next.dto");
const lesson_completed_webhook_dto_1 = require("./dto/lesson-completed-webhook.dto");
const next_item_request_dto_1 = require("./dto/next-item-request.dto");
const spanish_cards_dto_1 = require("./dto/spanish-cards.dto");
const learning_service_1 = require("./learning.service");
let LearningController = LearningController_1 = class LearningController {
    constructor(learningService) {
        this.learningService = learningService;
        this.logger = new common_1.Logger(LearningController_1.name);
    }
    getStatus() {
        return {
            ok: true,
            message: 'API Gateway está rodando 👌',
            timestamp: new Date().toISOString(),
        };
    }
    listModules() {
        return [
            {
                id: 'basico-1',
                title: 'Saudações e Apresentações',
                prerequisites: [],
                objectives: ['Cumprimentar', 'Se apresentar'],
                completionCriteria: { minAccuracy: 0.8, minExercises: 8, minVocabulary: 6 },
            },
            {
                id: 'basico-2',
                title: 'Rotina e Números',
                prerequisites: ['basico-1'],
                objectives: ['Descrever rotina', 'Falar de horários'],
                completionCriteria: { minAccuracy: 0.8, minExercises: 10, minVocabulary: 7 },
            },
        ];
    }
    getNextItem(payload) {
        const { completedItemIds, accuracyPercent, exercisesCompleted } = payload;
        const nextVocabularyItem = `vocab-item-${Date.now()}`;
        const vocabularyMastered = Array.isArray(completedItemIds)
            ? completedItemIds.length
            : 0;
        const progress = {
            currentAccuracy: accuracyPercent ?? null,
            exercisesCompleted: exercisesCompleted ?? 0,
            vocabularyMastered,
            nextSuggestedModule: 'basico-2',
        };
        return {
            nextItem: nextVocabularyItem,
            progress,
        };
    }
    async handleLessonCompletedWebhook(payload) {
        this.logger.log({
            studentId: payload.studentId,
            lessonId: payload.lessonId,
            score: payload.score,
            timestamp: payload.timestamp,
        }, '✅ Lesson completed webhook recebido');
        const response = await this.learningService.forwardLessonCompleted(payload);
        return {
            ...response,
            processedAt: new Date().toISOString(),
        };
    }
    async getNextCurriculumStep(payload) {
        return this.learningService.forwardCurriculumRequest(payload);
    }
    async getSpanishCards(payload) {
        const limit = payload.limit ?? 10;
        const cards = Array.from({ length: limit }).map((_, index) => ({
            front: `Carta ${index + 1} para ${payload.conceptId}`,
            back: `Tradução/explicação ${index + 1}`,
        }));
        return {
            conceptId: payload.conceptId,
            cards,
        };
    }
};
exports.LearningController = LearningController;
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Health-check do gateway' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Retorna status básico do gateway',
        schema: {
            example: {
                ok: true,
                message: 'API Gateway está rodando 👌',
                timestamp: '2024-06-30T12:34:56.000Z',
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LearningController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('modules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LearningController.prototype, "listModules", null);
__decorate([
    (0, common_1.Post)('next-item'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [next_item_request_dto_1.NextItemRequestDto]),
    __metadata("design:returntype", void 0)
], LearningController.prototype, "getNextItem", null);
__decorate([
    (0, common_1.Post)('lesson-completed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Webhook de conclusão de lição',
        description: 'Recebe eventos de lições concluídas e repassa ao orquestrador (stub).',
    }),
    (0, swagger_1.ApiBody)({
        type: lesson_completed_webhook_dto_1.LessonCompletedWebhookDto,
        examples: {
            default: {
                summary: 'Evento de conclusão',
                value: {
                    studentId: 'student-123',
                    lessonId: 'lesson-presente-indicativo',
                    score: 0.92,
                    timestamp: '2024-06-30T12:00:00.000Z',
                    metadata: { source: 'mobile-app', durationSeconds: 600 },
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Confirmação de recebimento do webhook',
        schema: {
            example: {
                success: true,
                message: 'Lesson completion recebida e processada (stub).',
                processedAt: '2024-06-30T12:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lesson_completed_webhook_dto_1.LessonCompletedWebhookDto]),
    __metadata("design:returntype", Promise)
], LearningController.prototype, "handleLessonCompletedWebhook", null);
__decorate([
    (0, common_1.Post)('curriculum/next'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [curriculum_next_dto_1.CurriculumNextDto]),
    __metadata("design:returntype", Promise)
], LearningController.prototype, "getNextCurriculumStep", null);
__decorate([
    (0, common_1.Post)('spanish/cards'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [spanish_cards_dto_1.SpanishCardsDto]),
    __metadata("design:returntype", Promise)
], LearningController.prototype, "getSpanishCards", null);
exports.LearningController = LearningController = LearningController_1 = __decorate([
    (0, swagger_1.ApiTags)('Learning'),
    (0, common_1.Controller)('learning'),
    __metadata("design:paramtypes", [learning_service_1.LearningService])
], LearningController);
//# sourceMappingURL=learning.controller.js.map