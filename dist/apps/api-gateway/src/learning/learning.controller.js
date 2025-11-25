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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningController = void 0;
const common_1 = require("@nestjs/common");
const lesson_completed_webhook_dto_1 = require("./dto/lesson-completed-webhook.dto");
let LearningController = class LearningController {
    getStatus() {
        return {
            ok: true,
            message: 'API Gateway está rodando 👌',
            timestamp: new Date().toISOString(),
        };
    }
    async handleLessonCompletedWebhook(payload) {
        console.log('✅ Lesson completed webhook recebido:', `studentId=${payload.studentId}`, `lessonId=${payload.lessonId}`, `score=${payload.score}`, `timestamp=${payload.timestamp}`);
        return {
            success: true,
            message: 'Lesson completion recebida e processada (stub).',
        };
    }
};
exports.LearningController = LearningController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LearningController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('lesson-completed'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lesson_completed_webhook_dto_1.LessonCompletedWebhookDto]),
    __metadata("design:returntype", Promise)
], LearningController.prototype, "handleLessonCompletedWebhook", null);
exports.LearningController = LearningController = __decorate([
    (0, common_1.Controller)('learning')
], LearningController);
//# sourceMappingURL=learning.controller.js.map