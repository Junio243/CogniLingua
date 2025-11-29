"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StudentProfilerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentProfilerService = void 0;
const common_1 = require("@nestjs/common");
let StudentProfilerService = StudentProfilerService_1 = class StudentProfilerService {
    constructor() {
        this.logger = new common_1.Logger(StudentProfilerService_1.name);
    }
    async getStudentProfile(studentId) {
        try {
            const now = new Date();
            const profile = {
                studentId,
                cognitiveState: [
                    {
                        conceptId: 'initial-assessment',
                        mastery: 0,
                        bktState: {
                            pLo: 0.2,
                            pG: 0.2,
                            pS: 0.1,
                            pT: 0.3,
                            pKnown: 0.2,
                        },
                        fsrsState: {
                            stability: 0,
                            difficulty: 0,
                            elapsedDays: 0,
                            scheduledDays: 0,
                            reps: 0,
                            lapses: 0,
                            state: 'Learning',
                        },
                        lastInteraction: now,
                        confidence: 0.5,
                    },
                ],
                overallProficiency: 0,
                learningVelocity: 0,
                interactionHistory: [
                    {
                        id: `${studentId}-initial`,
                        timestamp: now,
                        conceptId: 'initial-assessment',
                        type: 'lesson_start',
                        details: {},
                        outcome: 'neutral',
                    },
                ],
                fsrsParams: {
                    requestRetention: 0.9,
                    maximumInterval: 36500,
                    w: [],
                },
            };
            return this.serializeForJson(profile);
        }
        catch (error) {
            this.logger.error(`Failed to fetch student profile for ${studentId}`, error instanceof Error ? error.stack : `${error}`);
            return null;
        }
    }
    serializeForJson(profile) {
        const interactionHistory = (profile.interactionHistory ?? []).map((event) => ({
            ...event,
            id: event.id ?? `${profile.studentId}-${event.conceptId}-${Date.now()}`,
            timestamp: this.toDate(event.timestamp ?? new Date()),
            details: event.details ?? {},
        }));
        const cognitiveState = (profile.cognitiveState ?? []).map((entry) => ({
            ...entry,
            mastery: entry.mastery ?? 0,
            bktState: entry.bktState ??
                {
                    pLo: 0,
                    pG: 0,
                    pS: 0,
                    pT: 0,
                    pKnown: 0,
                },
            fsrsState: entry.fsrsState ??
                {
                    stability: 0,
                    difficulty: 0,
                    elapsedDays: 0,
                    scheduledDays: 0,
                    reps: 0,
                    lapses: 0,
                    state: 'Learning',
                },
            lastInteraction: entry.lastInteraction
                ? this.toDate(entry.lastInteraction)
                : undefined,
            confidence: entry.confidence ?? 0,
        }));
        return {
            studentId: profile.studentId,
            cognitiveState,
            overallProficiency: profile.overallProficiency ?? 0,
            learningVelocity: profile.learningVelocity ?? 0,
            interactionHistory,
            fsrsParams: profile.fsrsParams ??
                { requestRetention: 0.9, maximumInterval: 36500, w: [] },
        };
    }
    toDate(value) {
        const isoString = new Date(value).toISOString();
        return new Date(isoString);
    }
};
exports.StudentProfilerService = StudentProfilerService;
exports.StudentProfilerService = StudentProfilerService = StudentProfilerService_1 = __decorate([
    (0, common_1.Injectable)()
], StudentProfilerService);
//# sourceMappingURL=student-profiler.service.js.map