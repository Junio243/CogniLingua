import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { MetricsModule } from '../metrics/metrics.module';
import { GrpcModule } from '../grpc/grpc.module';
import { RedisCircuitBreakerService } from './redis-circuit-breaker.service';
import { RedisStreamConsumerService } from './redis-stream-consumer.service';

@Module({
  imports: [ConfigModule, MetricsModule, GrpcModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          maxRetriesPerRequest: 2,
          enableReadyCheck: true,
        });
      },
      inject: [ConfigService],
    },
    RedisCircuitBreakerService,
    RedisStreamConsumerService,
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
