// Original file: libs/shared/src/proto/curriculum-orchestrator.proto

import type { Long } from '@grpc/proto-loader';

export interface CurriculumSignal {
  'studentId'?: (string);
  'currentConceptId'?: (string);
  'mastery'?: (number | string);
  'cognitiveLoadOverride'?: (number | string);
  'accuracyPercent'?: (number | string);
  'exercisesCompleted'?: (number);
  'correlationId'?: (string);
  'eventTimestamp'?: (number | string | Long);
}

export interface CurriculumSignal__Output {
  'studentId'?: (string);
  'currentConceptId'?: (string);
  'mastery'?: (number);
  'cognitiveLoadOverride'?: (number);
  'accuracyPercent'?: (number);
  'exercisesCompleted'?: (number);
  'correlationId'?: (string);
  'eventTimestamp'?: (Long);
}
