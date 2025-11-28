import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BurnoutAlert, InteractionEvent } from '../interfaces/interaction-event.interface';

interface CognitiveAnalyzerServiceClient {
  streamInteractions(request: { events: InteractionEvent[] }): any;
  emitBurnoutAlert(request: BurnoutAlertRequest): any;
}

interface BurnoutAlertRequest {
  userId: string;
  riskLevel: string;
  correlationId?: string;
  observedAt: number;
}

interface InteractionStreamResponse {
  accepted: number;
  status: string;
}

interface BurnoutAlertAck {
  userId: string;
  status: string;
  message: string;
}

@Injectable()
export class GrpcProducerService implements OnModuleInit {
  private grpcService: CognitiveAnalyzerServiceClient;

  constructor(@Inject('COGNITIVE_ANALYZER_GRPC_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.client.getService<CognitiveAnalyzerServiceClient>('CognitiveAnalyzerService');
  }

  async publishInteractions(events: InteractionEvent[]): Promise<InteractionStreamResponse | undefined> {
    if (!this.grpcService?.streamInteractions) {
      return undefined;
    }

    const observable = this.grpcService.streamInteractions({ events });
    return firstValueFrom(observable as any);
  }

  async emitBurnoutAlert(alert: BurnoutAlert): Promise<BurnoutAlertAck | undefined> {
    if (!this.grpcService?.emitBurnoutAlert) {
      return undefined;
    }

    const observable = this.grpcService.emitBurnoutAlert({
      userId: alert.userId,
      riskLevel: alert.riskLevel,
      correlationId: alert.correlationId,
      observedAt: alert.observedAt,
    });

    return firstValueFrom(observable as any);
  }
}
