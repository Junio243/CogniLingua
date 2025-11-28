import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private latencies: number[] = [];
  private throughputWindow: number[] = [];
  private readonly windowSizeMs = 60_000;

  recordLatency(durationMs: number): void {
    if (Number.isFinite(durationMs)) {
      this.latencies.push(durationMs);
      if (this.latencies.length > 5000) {
        this.latencies.shift();
      }
    }
  }

  recordThroughput(): void {
    const now = Date.now();
    this.throughputWindow.push(now);
    this.trimWindow(now);
  }

  getMetrics() {
    const now = Date.now();
    this.trimWindow(now);

    const totalEvents = this.throughputWindow.length;
    const throughputPerMinute = Math.round((totalEvents / this.windowSizeMs) * 60_000);

    const latencySnapshot = this.latencies.slice(-1000);
    const latencyCount = latencySnapshot.length;
    const averageLatency =
      latencyCount > 0
        ? latencySnapshot.reduce((sum, current) => sum + current, 0) / latencyCount
        : 0;

    const sortedLatencies = latencySnapshot.slice().sort((a, b) => a - b);
    const p95Latency = this.percentile(sortedLatencies, 0.95);

    return {
      throughputPerMinute,
      observedEvents: totalEvents,
      latency: {
        count: latencyCount,
        averageMs: Number(averageLatency.toFixed(2)),
        p95Ms: Number(p95Latency.toFixed(2)),
      },
    };
  }

  private percentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) {
      return 0;
    }

    const index = Math.ceil(percentile * sortedValues.length) - 1;
    return sortedValues[Math.max(0, index)];
  }

  private trimWindow(reference: number) {
    const limit = reference - this.windowSizeMs;
    while (this.throughputWindow.length && this.throughputWindow[0] < limit) {
      this.throughputWindow.shift();
    }
  }
}
