// Original file: libs/shared/src/proto/curriculum-orchestrator.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Ack as _curriculum_orchestrator_v1_Ack, Ack__Output as _curriculum_orchestrator_v1_Ack__Output } from '../../../curriculum/orchestrator/v1/Ack';
import type { CurriculumNextResponse as _curriculum_orchestrator_v1_CurriculumNextResponse, CurriculumNextResponse__Output as _curriculum_orchestrator_v1_CurriculumNextResponse__Output } from '../../../curriculum/orchestrator/v1/CurriculumNextResponse';
import type { CurriculumSignal as _curriculum_orchestrator_v1_CurriculumSignal, CurriculumSignal__Output as _curriculum_orchestrator_v1_CurriculumSignal__Output } from '../../../curriculum/orchestrator/v1/CurriculumSignal';

export interface CurriculumOrchestratorClient extends grpc.Client {
  RequestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  RequestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  RequestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  RequestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  requestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  requestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  requestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  requestNextConcept(argument: _curriculum_orchestrator_v1_CurriculumSignal, callback: grpc.requestCallback<_curriculum_orchestrator_v1_CurriculumNextResponse__Output>): grpc.ClientUnaryCall;
  
  SendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  SendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  SendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  SendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  sendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  sendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, metadata: grpc.Metadata, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  sendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, options: grpc.CallOptions, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  sendLearningSignal(argument: _curriculum_orchestrator_v1_CurriculumSignal, callback: grpc.requestCallback<_curriculum_orchestrator_v1_Ack__Output>): grpc.ClientUnaryCall;
  
}

export interface CurriculumOrchestratorHandlers extends grpc.UntypedServiceImplementation {
  RequestNextConcept: grpc.handleUnaryCall<_curriculum_orchestrator_v1_CurriculumSignal__Output, _curriculum_orchestrator_v1_CurriculumNextResponse>;
  
  SendLearningSignal: grpc.handleUnaryCall<_curriculum_orchestrator_v1_CurriculumSignal__Output, _curriculum_orchestrator_v1_Ack>;
  
}

export interface CurriculumOrchestratorDefinition extends grpc.ServiceDefinition {
  RequestNextConcept: MethodDefinition<_curriculum_orchestrator_v1_CurriculumSignal, _curriculum_orchestrator_v1_CurriculumNextResponse, _curriculum_orchestrator_v1_CurriculumSignal__Output, _curriculum_orchestrator_v1_CurriculumNextResponse__Output>
  SendLearningSignal: MethodDefinition<_curriculum_orchestrator_v1_CurriculumSignal, _curriculum_orchestrator_v1_Ack, _curriculum_orchestrator_v1_CurriculumSignal__Output, _curriculum_orchestrator_v1_Ack__Output>
}
