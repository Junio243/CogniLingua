// Original file: libs/shared/src/proto/curriculum-orchestrator.proto


export interface CurriculumNextResponse {
  'nextConceptId'?: (string);
  'rationale'?: (string);
  'recommendedLoad'?: (number | string);
  'projectedMastery'?: (number | string);
  'correlationId'?: (string);
}

export interface CurriculumNextResponse__Output {
  'nextConceptId'?: (string);
  'rationale'?: (string);
  'recommendedLoad'?: (number);
  'projectedMastery'?: (number);
  'correlationId'?: (string);
}
