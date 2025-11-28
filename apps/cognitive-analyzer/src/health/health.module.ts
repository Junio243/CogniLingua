import { Module } from '@nestjs/common';
import { MetricsModule } from '../metrics/metrics.module';
import { RedisModule } from '../redis/redis.module';
import { HealthController } from './health.controller';

@Module({
  imports: [MetricsModule, RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}
