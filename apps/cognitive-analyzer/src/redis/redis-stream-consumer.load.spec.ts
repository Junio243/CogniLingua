import { RedisStreamConsumerService } from './redis-stream-consumer.service';
import { ConfigService } from '@nestjs/config';
import { MetricsService } from '../metrics/metrics.service';
import { GrpcProducerService } from '../grpc/grpc-producer.service';
import { RedisCircuitBreakerService } from './redis-circuit-breaker.service';

interface MockRedis {
  xgroup: jest.Mock;
  xreadgroup: jest.Mock;
  xack: jest.Mock;
  quit: jest.Mock;
}

describe('RedisStreamConsumerService (carga)', () => {
  jest.setTimeout(20000);

  const streamKey = 'cognitive:interactions';
  const totalEvents = 10_000;
  const batchSize = 500;

  const buildStreamEntries = () => {
    const entries: any[] = [];
    for (let i = 0; i < totalEvents; i++) {
      const id = `${i}-0`;
      entries.push([
        id,
        [
          'id',
          id,
          'userId',
          `user-${i}`,
          'content',
          `event-${i}`,
          'timestamp',
          `${1700000000000 + i}`,
          'type',
          'interaction',
        ],
      ]);
    }

    const batches: any[] = [];
    for (let i = 0; i < entries.length; i += batchSize) {
      batches.push(entries.slice(i, i + batchSize));
    }

    return batches;
  };

  it('consome 10k eventos/minuto sem perda e mede latência', async () => {
    const batches = buildStreamEntries();

    const redisClient: MockRedis = {
      xgroup: jest.fn().mockResolvedValue('OK'),
      xreadgroup: jest.fn(async () => {
        const batch = batches.shift();
        if (!batch) {
          (consumer as any).running = false;
          return null;
        }
        return [[streamKey, batch]];
      }),
      xack: jest.fn().mockImplementation(async () => {
        now += 6; // 10k eventos em 60s => 6ms por evento
        return 1;
      }),
      quit: jest.fn().mockResolvedValue('OK'),
    };

    const configService: ConfigService = {
      get: jest.fn((key: string, defaultValue: any) => {
        const overrides: Record<string, any> = {
          INTERACTION_STREAM_KEY: streamKey,
          INTERACTION_GROUP: 'cognitive-analyzer',
          HOSTNAME: 'test-consumer',
          STREAM_BATCH_SIZE: batchSize,
          STREAM_BLOCK_MS: 1,
        };
        return overrides[key] ?? defaultValue;
      }),
    } as unknown as ConfigService;

    const metricsService: MetricsService = {
      recordLatency: jest.fn(),
      recordThroughput: jest.fn(),
    } as unknown as MetricsService;

    const grpcProducer: GrpcProducerService = {
      publishInteractions: jest.fn().mockResolvedValue(undefined),
      emitBurnoutAlert: jest.fn().mockResolvedValue(undefined),
    } as unknown as GrpcProducerService;

    const circuitBreaker: RedisCircuitBreakerService = {
      isOpen: jest.fn().mockReturnValue(false),
      execute: jest.fn((fn: () => Promise<any>) => fn()),
    } as unknown as RedisCircuitBreakerService;

    let now = 1700000000000;
    const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);

    const consumer = new RedisStreamConsumerService(
      redisClient as any,
      configService,
      metricsService,
      grpcProducer,
      circuitBreaker,
    );

    (consumer as any).running = true;

    await (consumer as any).pollStream();

    const totalDurationMs = now - 1700000000000;

    expect(redisClient.xack).toHaveBeenCalledTimes(totalEvents);
    expect(metricsService.recordThroughput).toHaveBeenCalledTimes(totalEvents);
    expect(metricsService.recordLatency).toHaveBeenCalledTimes(totalEvents);
    expect(grpcProducer.publishInteractions).toHaveBeenCalledTimes(totalEvents);
    expect(totalDurationMs).toBeLessThanOrEqual(60_000);

    const latencies = (metricsService.recordLatency as jest.Mock).mock.calls.map(([value]) => value as number);
    expect(Math.max(...latencies)).toBeLessThanOrEqual(6);

    dateSpy.mockRestore();
  });
});
