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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonCompletedWebhookDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LessonCompletedWebhookDto {
}
exports.LessonCompletedWebhookDto = LessonCompletedWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identificador único do aluno', example: 'student-123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LessonCompletedWebhookDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identificador da lição concluída', example: 'lesson-presente-indicativo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LessonCompletedWebhookDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Score bruto da tentativa', example: 0.92 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LessonCompletedWebhookDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp ISO8601 do evento', example: '2024-06-30T12:00:00.000Z' }),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], LessonCompletedWebhookDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metadados adicionais enviados pelo cliente',
        example: { source: 'mobile-app', durationSeconds: 600 },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], LessonCompletedWebhookDto.prototype, "metadata", void 0);
//# sourceMappingURL=lesson-completed-webhook.dto.js.map