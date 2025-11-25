import { Injectable } from '@nestjs/common';
import { Neo4jService, ConceptNode } from '../neo4j/neo4j.service';
import { StudentProfilerService } from '../student-profiler/student-profiler.service';
import { StudentProfile } from '@cognilingua/shared';

export interface CurriculumConcept extends ConceptNode {
  mastery: number;
  readinessScore: number;
}

@Injectable()
export class CurriculumService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly studentProfilerService: StudentProfilerService,
  ) {}

  /**
   * Gera um "currículo personalizado" ordenado por readinessScore.
   */
  async getPersonalizedCurriculum(
    studentId: string,
  ): Promise<CurriculumConcept[]> {
    const [allConcepts, profile] = await Promise.all([
      this.neo4jService.getAllConcepts(),
      this.studentProfilerService.getStudentProfile(studentId),
    ]);

    const masteryMap = this.buildMasteryMap(profile);

    const enriched: CurriculumConcept[] = [];
    for (const concept of allConcepts) {
      const mastery = masteryMap.get(concept.id) ?? 0;
      const readinessScore = await this.getConceptReadiness(
        concept.id,
        mastery,
        profile,
      );

      enriched.push({
        ...concept,
        mastery,
        readinessScore,
      });
    }

    // Conceitos mais "prontos" primeiro
    enriched.sort(
      (a, b) => (b.readinessScore ?? 0) - (a.readinessScore ?? 0),
    );

    return enriched;
  }

  /**
   * Cria um Map conceptId -> mastery com base no StudentProfile.
   */
  private buildMasteryMap(profile: StudentProfile | null): Map<string, number> {
    const map = new Map<string, number>();

    if (!profile || !Array.isArray(profile.cognitiveState)) {
      return map;
    }

    for (const cs of profile.cognitiveState) {
      map.set(cs.conceptId, cs.mastery ?? 0);
    }

    return map;
  }

  /**
   * Heurística simples:
   * readiness = 0.6 * masteryDireta + 0.4 * médiaMasteryPrereqs
   */
  private async getConceptReadiness(
    conceptId: string,
    directMastery: number,
    profile: StudentProfile | null,
  ): Promise<number> {
    const prereqMastery = await this.getPrerequisiteMastery(
      conceptId,
      profile,
    );

    const readiness = 0.6 * directMastery + 0.4 * prereqMastery;
    return readiness;
  }

  /**
   * Calcula a média do mastery dos pré-requisitos de um conceito.
   */
  private async getPrerequisiteMastery(
    conceptId: string,
    profile: StudentProfile | null,
  ): Promise<number> {
    if (!profile || !Array.isArray(profile.cognitiveState)) {
      return 0;
    }

    const masteryMap = this.buildMasteryMap(profile);
    const prereqIds =
      await this.neo4jService.getPrerequisiteConceptIds(conceptId);

    if (!prereqIds.length) {
      // Se não tem prereq, considera "ok" (1.0)
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
}
