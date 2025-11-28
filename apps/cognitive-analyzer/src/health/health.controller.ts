import { Controller, Get, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { MetricsService } from '../metrics/metrics.service';

@Controller('health')
export class HealthController {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  async getHealth() {
    const redisStatus = await this.checkRedis();

    return {
      status: redisStatus === 'PONG' ? 'ok' : 'degraded',
      redis: redisStatus,
      metrics: this.metricsService.getMetrics(),
    };
  }

  private async checkRedis(): Promise<string> {
    try {
      return await this.redisClient.ping();
    } catch (error) {
      return `unavailable: ${(error as Error).message}`;
    }
  }
}
