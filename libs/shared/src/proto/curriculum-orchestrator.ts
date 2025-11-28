import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { CurriculumOrchestratorClient as _curriculum_orchestrator_v1_CurriculumOrchestratorClient, CurriculumOrchestratorDefinition as _curriculum_orchestrator_v1_CurriculumOrchestratorDefinition } from './curriculum/orchestrator/v1/CurriculumOrchestrator';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  curriculum: {
    orchestrator: {
      v1: {
        Ack: MessageTypeDefinition
        CurriculumNextResponse: MessageTypeDefinition
        CurriculumOrchestrator: SubtypeConstructor<typeof grpc.Client, _curriculum_orchestrator_v1_CurriculumOrchestratorClient> & { service: _curriculum_orchestrator_v1_CurriculumOrchestratorDefinition }
        CurriculumSignal: MessageTypeDefinition
      }
    }
  }
}

