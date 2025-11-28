import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisCircuitBreakerService {
  private failures = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt = Date.now();
  private readonly logger = new Logger(RedisCircuitBreakerService.name);

  constructor(private readonly failureThreshold = 5, private readonly cooldownMs = 5_000) {}

  async execute<T>(handler: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker open for Redis operations');
      }
      this.state = 'HALF_OPEN';
      this.logger.warn('Redis circuit breaker half-open: probing connectivity');
    }

    try {
      const result = await handler();
      this.reset();
      return result;
    } catch (error) {
      this.registerFailure(error);
      throw error;
    }
  }

  isOpen(): boolean {
    return this.state === 'OPEN';
  }

  private registerFailure(error: unknown) {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.cooldownMs;
      this.logger.error(`Redis circuit opened after ${this.failures} failures: ${error}`);
    }
  }

  private reset() {
    if (this.failures > 0 || this.state !== 'CLOSED') {
      this.logger.log('Redis circuit reset after successful operation');
    }
    this.failures = 0;
    this.state = 'CLOSED';
  }
}
