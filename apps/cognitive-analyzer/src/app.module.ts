import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MetricsModule, HealthModule, RedisModule, GrpcModule],
})
export class AppModule {}
