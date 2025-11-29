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
const semantic_alignment_service_1 = require("./semantic-alignment.service");
let CurriculumService = class CurriculumService {
    constructor(neo4jService, studentProfilerService, semanticAlignmentService) {
        this.neo4jService = neo4jService;
        this.studentProfilerService = studentProfilerService;
        this.semanticAlignmentService = semanticAlignmentService;
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
    async generateRemediationLesson(conceptId, proficiencyGap, studentId) {
        const boundedGap = Math.min(Math.max(proficiencyGap, 0), 1);
        const profile = studentId
            ? await this.studentProfilerService.getStudentProfile(studentId)
            : null;
        const masteryMap = this.buildMasteryMap(profile);
        const currentMastery = masteryMap.get(conceptId) ?? 0;
        const targetMastery = Math.min(1, currentMastery + boundedGap);
        const semanticEvidence = await this.semanticAlignmentService.alignHistoryWithConcepts(profile, {
            [conceptId]: [
                `Remediation focus for ${conceptId}`,
                'Identify misconceptions and prior attempts',
                'Surface just-in-time explanation references',
            ],
        });
        const evidenceSlice = semanticEvidence.slice(0, 3);
        const diagnosticHint = evidenceSlice[0]?.evidence ??
            'Nenhuma interação anterior relevante encontrada.';
        const steps = [
            {
                title: 'Diagnóstico orientado por histórico',
                intent: 'Contextualizar o erro recente ou lacuna de compreensão.',
                payload: {
                    conceptId,
                    diagnosticHint,
                    similarity: evidenceSlice[0]?.similarity ?? 0,
                },
            },
            {
                title: 'Micro-explicação adaptada',
                intent: 'Fornecer explicação curta ancorada nos exemplos já vistos pelo aluno.',
                payload: {
                    conceptId,
                    anchorSamples: evidenceSlice.map((item) => item.evidence),
                    targetMastery,
                },
            },
            {
                title: 'Prática just-in-time',
                intent: 'Aplicar um exercício rápido calibrado pelo gap de proficiência e FSRS.',
                payload: {
                    conceptId,
                    difficultyScaler: 0.5 + boundedGap / 2,
                    expectedMasteryLift: boundedGap,
                },
            },
        ];
        return {
            conceptId,
            proficiencyGap: boundedGap,
            targetMastery,
            steps,
            semanticEvidence,
        };
    }
    async buildNextConceptFromSignal(signal) {
        const personalized = await this.getPersonalizedCurriculum(signal.studentId);
        const topConcept = personalized[0];
        const fallbackConceptId = signal.currentConceptId
            ? `${signal.currentConceptId}-next`
            : 'concept-0001';
        const recommendedLoad = Math.min(1, Math.max(0, Number(signal.cognitiveLoadOverride ?? 0.5)));
        const projectedMastery = Math.min(1, Number(topConcept?.mastery ?? signal.mastery ?? 0) + 0.05);
        const rationaleParts = [
            'Recomendação gRPC com contrato v1 enriquecido.',
        ];
        if (typeof signal.accuracyPercent === 'number') {
            rationaleParts.push(`Acurácia recente: ${(Number(signal.accuracyPercent) * 100).toFixed(1)}%.`);
        }
        rationaleParts.push(`Carga cognitiva sugerida: ${(recommendedLoad * 100).toFixed(0)}%.`);
        return {
            nextConceptId: topConcept?.id ?? fallbackConceptId,
            rationale: rationaleParts.join(' '),
            recommendedLoad,
            projectedMastery,
            correlationId: signal.correlationId,
        };
    }
};
exports.CurriculumService = CurriculumService;
exports.CurriculumService = CurriculumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [neo4j_service_1.Neo4jService,
        student_profiler_service_1.StudentProfilerService,
        semantic_alignment_service_1.SemanticAlignmentService])
], CurriculumService);
//# sourceMappingURL=curriculum.service.js.map