import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { MetricsService } from '../metrics/metrics.service';
import { GrpcProducerService } from '../grpc/grpc-producer.service';
import { BurnoutAlert, InteractionEvent } from '../interfaces/interaction-event.interface';
import { RedisCircuitBreakerService } from './redis-circuit-breaker.service';

interface RedisStreamMessage {
  id: string;
  fields: Record<string, string>;
}

@Injectable()
export class RedisStreamConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisStreamConsumerService.name);
  private running = false;
  private readonly streamKey: string;
  private readonly consumerGroup: string;
  private readonly consumerName: string;
  private readonly batchSize: number;
  private readonly blockMs: number;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    private readonly metricsService: MetricsService,
    private readonly grpcProducer: GrpcProducerService,
    private readonly circuitBreaker: RedisCircuitBreakerService,
  ) {
    this.streamKey = this.configService.get<string>('INTERACTION_STREAM_KEY', 'cognitive:interactions');
    this.consumerGroup = this.configService.get<string>('INTERACTION_GROUP', 'cognitive-analyzer');
    this.consumerName = this.configService.get<string>('HOSTNAME', 'analyzer-worker');
    this.batchSize = Number(this.configService.get<number>('STREAM_BATCH_SIZE', 250));
    this.blockMs = Number(this.configService.get<number>('STREAM_BLOCK_MS', 2000));
  }

  async onModuleInit() {
    await this.ensureGroup();
    this.running = true;
    this.pollStream();
  }

  async onModuleDestroy() {
    this.running = false;
    await this.redisClient.quit();
  }

  private async ensureGroup() {
    try {
      await this.redisClient.xgroup('CREATE', this.streamKey, this.consumerGroup, '$', 'MKSTREAM');
      this.logger.log(`Consumer group ${this.consumerGroup} created for stream ${this.streamKey}`);
    } catch (error: any) {
      if (error?.message?.includes('BUSYGROUP')) {
        this.logger.log(`Consumer group ${this.consumerGroup} already exists`);
      } else {
        this.logger.error('Failed to create consumer group', error);
      }
    }
  }

  private async pollStream() {
    while (this.running) {
      if (this.circuitBreaker.isOpen()) {
        await this.delay(500);
        continue;
      }

      try {
        const response = await this.circuitBreaker.execute(() =>
          this.redisClient.xreadgroup(
            'GROUP',
            this.consumerGroup,
            this.consumerName,
            'COUNT',
            this.batchSize,
            'BLOCK',
            this.blockMs,
            'STREAMS',
            this.streamKey,
            '>',
          ),
        );

        const streamEntries = this.normalizeResponse(response);
        for (const message of streamEntries) {
          const started = Date.now();
          await this.processMessage(message);
          await this.redisClient.xack(this.streamKey, this.consumerGroup, message.id);
          const latency = Date.now() - started;
          this.metricsService.recordLatency(latency);
          this.metricsService.recordThroughput();
        }
      } catch (error) {
        this.logger.error('Error consuming Redis stream', error as Error);
        await this.delay(250);
      }
    }
  }

  private normalizeResponse(response: any): RedisStreamMessage[] {
    if (!response || !Array.isArray(response)) {
      return [];
    }

    const [, entries] = response[0];
    return entries.map((entry: any) => {
      const [id, rawFields] = entry;
      const fields: Record<string, string> = {};

      for (let i = 0; i < rawFields.length; i += 2) {
        fields[rawFields[i]] = rawFields[i + 1];
      }

      return { id, fields } as RedisStreamMessage;
    });
  }

  private async processMessage(message: RedisStreamMessage) {
    const interaction = this.toInteractionEvent(message);

    if (!interaction) {
      this.logger.warn(`Skipping malformed message ${message.id}`);
      return;
    }

    if (interaction.type === 'burnout_alert') {
      const alert: BurnoutAlert = {
        userId: interaction.userId,
        riskLevel: interaction.content,
        correlationId: interaction.id,
        observedAt: interaction.timestamp,
      };
      await this.grpcProducer.emitBurnoutAlert(alert);
      return;
    }

    await this.grpcProducer.publishInteractions([interaction]);
  }

  private toInteractionEvent(message: RedisStreamMessage): InteractionEvent | null {
    const { fields } = message;
    if (!fields['userId'] || !fields['content']) {
      return null;
    }

    return {
      id: fields['id'] || message.id,
      userId: fields['userId'],
      content: fields['content'],
      timestamp: Number(fields['timestamp'] || Date.now()),
      type: (fields['type'] as any) || 'interaction',
    };
  }

  private delay(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
}
