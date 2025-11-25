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
exports.CurriculumService = void 0;
const common_1 = require("@nestjs/common");
const neo4j_service_1 = require("../neo4j/neo4j.service");
const student_profiler_service_1 = require("../student-profiler/student-profiler.service");
let CurriculumService = class CurriculumService {
    constructor(neo4jService, studentProfilerService) {
        this.neo4jService = neo4jService;
        this.studentProfilerService = studentProfilerService;
    }
    async getPersonalizedCurriculum(studentId) {
        const [allConcepts, profile] = await Promise.all([
            this.neo4jService.getAllConcepts(),
            this.studentProfilerService.getStudentProfile(studentId),
        ]);
        const masteryMap = this.buildMasteryMap(profile);
        const enriched = [];
        for (const concept of allConcepts) {
            const mastery = masteryMap.get(concept.id) ?? 0;
            const readinessScore = await this.getConceptReadiness(concept.id, mastery, profile);
            enriched.push({
                ...concept,
                mastery,
                readinessScore,
            });
        }
        enriched.sort((a, b) => (b.readinessScore ?? 0) - (a.readinessScore ?? 0));
        return enriched;
    }
    buildMasteryMap(profile) {
        const map = new Map();
        if (!profile || !Array.isArray(profile.cognitiveState)) {
            return map;
        }
        for (const cs of profile.cognitiveState) {
            map.set(cs.conceptId, cs.mastery ?? 0);
        }
        return map;
    }
    async getConceptReadiness(conceptId, directMastery, profile) {
        const prereqMastery = await this.getPrerequisiteMastery(conceptId, profile);
        const readiness = 0.6 * directMastery + 0.4 * prereqMastery;
        return readiness;
    }
    async getPrerequisiteMastery(conceptId, profile) {
        if (!profile || !Array.isArray(profile.cognitiveState)) {
            return 0;
        }
        const masteryMap = this.buildMasteryMap(profile);
        const prereqIds = await this.neo4jService.getPrerequisiteConceptIds(conceptId);
        if (!prereqIds.length) {
            return 1;
        }
        let total = 0;
        let count = 0;
        for (const id of prereqIds) {
            total += masteryMap.get(id) ?? 0;
            count++;
        }
        return count > 0 ? total / count : 0;
    }
};
exports.CurriculumService = CurriculumService;
exports.CurriculumService = CurriculumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService,
        student_profiler_service_1.StudentProfilerService])
], CurriculumService);
//# sourceMappingURL=curriculum.service.js.map