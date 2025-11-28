import { Injectable, Logger } from '@nestjs/common';
import { BKTState } from '@cognilingua/shared';
import { BKTEngine } from '../bkt/bkt.engine';

export interface TransformerEstimator {
  estimateState(currentState: BKTState, correct: boolean): BKTState;
}

export interface HybridDecisionMetrics {
  latencyMs: number;
  confidence: number;
  fallbackReason?: string;
}

export interface HybridDecision {
  engineUsed: 'bkt' | 'transformer';
  state: BKTState;
  metrics: HybridDecisionMetrics;
}

class DefaultTransformerEstimator implements TransformerEstimator {
  estimateState(currentState: BKTState, correct: boolean): BKTState {
    const adjustment = correct ? 0.1 : -0.1;
    const nextKnown = Math.min(1, Math.max(0, currentState.pKnown + adjustment));

    return {
      ...currentState,
      pKnown: nextKnown,
      pLo: Math.max(currentState.pLo, nextKnown),
    };
  }
}

@Injectable()
export class HybridProfilerPipeline {
  private readonly logger = new Logger(HybridProfilerPipeline.name);
  private readonly decisions: HybridDecision[] = [];

  constructor(
    private readonly bktEngine: BKTEngine = new BKTEngine(),
    private readonly transformer: TransformerEstimator = new DefaultTransformerEstimator(),
    private readonly clock: () => number = () => Date.now(),
  ) {}

  runStep(currentState: BKTState, correct: boolean): HybridDecision {
    const start = this.clock();

    try {
      const updatedState = this.bktEngine.updateKnowledgeState(currentState, correct);
      const latencyMs = this.clock() - start;
      const decision: HybridDecision = {
        engineUsed: 'bkt',
        state: updatedState,
        metrics: {
          latencyMs,
          confidence: updatedState.pKnown,
        },
      };

      this.logger.log(
        `Hybrid pipeline selecionou BKT (latência ${latencyMs}ms, confiança ${updatedState.pKnown.toFixed(2)})`,
      );
      this.decisions.push(decision);
      return decision;
    } catch (error) {
      const fallbackStart = this.clock();
      const transformerState = this.transformer.estimateState(currentState, correct);
      const latencyMs = this.clock() - fallbackStart;
      const fallbackReason = error instanceof Error ? error.message : 'Unknown BKT failure';

      const decision: HybridDecision = {
        engineUsed: 'transformer',
        state: transformerState,
        metrics: {
          latencyMs,
          confidence: transformerState.pKnown,
          fallbackReason,
        },
      };

      this.logger.warn(
        `BKT falhou (${fallbackReason}); fallback para Transformer (latência ${latencyMs}ms)`,
      );
      this.decisions.push(decision);
      return decision;
    }
  }

  getDecisionLog(): HybridDecision[] {
    return [...this.decisions];
  }
}
