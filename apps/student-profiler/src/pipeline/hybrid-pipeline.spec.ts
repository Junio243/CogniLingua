import { BKTState } from '@cognilingua/shared';
import { BKTEngine } from '../bkt/bkt.engine';
import { HybridProfilerPipeline, TransformerEstimator } from './hybrid-pipeline';

describe('HybridProfilerPipeline', () => {
  const baseState: BKTState = {
    pLo: 0.2,
    pG: 0.1,
    pS: 0.1,
    pT: 0.05,
    pKnown: 0.2,
  };

  it('usa BKT como default e registra métricas de decisão', () => {
    const updatedState: BKTState = { ...baseState, pKnown: 0.42, pLo: 0.45 };
    const bktEngine: BKTEngine = {
      updateKnowledgeState: jest.fn().mockReturnValue(updatedState),
    } as unknown as BKTEngine;

    const transformer: TransformerEstimator = {
      estimateState: jest.fn(),
    };

    const ticks = [100, 112];
    const pipeline = new HybridProfilerPipeline(bktEngine, transformer, () => ticks.shift() as number);

    const decision = pipeline.runStep(baseState, true);

    expect(decision.engineUsed).toBe('bkt');
    expect(decision.state).toEqual(updatedState);
    expect(decision.metrics.latencyMs).toBe(12);
    expect(decision.metrics.confidence).toBeCloseTo(updatedState.pKnown);
    expect(transformer.estimateState).not.toHaveBeenCalled();

    const log = pipeline.getDecisionLog();
    expect(log).toHaveLength(1);
    expect(log[0].engineUsed).toBe('bkt');
  });

  it('faz fallback para Transformer quando o BKT falha e registra razão', () => {
    const bktEngine: BKTEngine = {
      updateKnowledgeState: jest.fn(() => {
        throw new Error('BKT indisponível');
      }),
    } as unknown as BKTEngine;

    const transformerState: BKTState = { ...baseState, pKnown: 0.65, pLo: 0.65 };
    const transformer: TransformerEstimator = {
      estimateState: jest.fn().mockReturnValue(transformerState),
    };

    const ticks = [200, 205, 215];
    const pipeline = new HybridProfilerPipeline(bktEngine, transformer, () => ticks.shift() as number);

    const decision = pipeline.runStep(baseState, false);

    expect(decision.engineUsed).toBe('transformer');
    expect(decision.state).toEqual(transformerState);
    expect(decision.metrics.fallbackReason).toContain('BKT indisponível');
    expect(decision.metrics.latencyMs).toBe(10);
    expect(transformer.estimateState).toHaveBeenCalledWith(baseState, false);

    const log = pipeline.getDecisionLog();
    expect(log).toHaveLength(1);
    expect(log[0].engineUsed).toBe('transformer');
  });

  it('registra fallback para Transformer após uma execução bem-sucedida do BKT', () => {
    const bktStateAfterSuccess: BKTState = { ...baseState, pKnown: 0.33, pLo: 0.35 };
    const transformerState: BKTState = { ...baseState, pKnown: 0.72, pLo: 0.75 };

    const bktEngine: BKTEngine = {
      updateKnowledgeState: jest
        .fn()
        .mockReturnValueOnce(bktStateAfterSuccess)
        .mockImplementationOnce(() => {
          throw new Error('Intermitência no BKT');
        }),
    } as unknown as BKTEngine;

    const transformer: TransformerEstimator = {
      estimateState: jest.fn().mockReturnValue(transformerState),
    };

    const ticks = [10, 18, 30, 40, 48, 58];
    const pipeline = new HybridProfilerPipeline(bktEngine, transformer, () => ticks.shift() as number);

    const firstDecision = pipeline.runStep(baseState, true);
    expect(firstDecision.engineUsed).toBe('bkt');
    expect(firstDecision.state).toEqual(bktStateAfterSuccess);
    expect(firstDecision.metrics.latencyMs).toBe(8);

    const fallbackDecision = pipeline.runStep(firstDecision.state, false);
    expect(fallbackDecision.engineUsed).toBe('transformer');
    expect(fallbackDecision.state).toEqual(transformerState);
    expect(fallbackDecision.metrics.latencyMs).toBe(8);
    expect(fallbackDecision.metrics.fallbackReason).toContain('Intermitência no BKT');
    expect(transformer.estimateState).toHaveBeenCalledWith(firstDecision.state, false);

    const log = pipeline.getDecisionLog();
    expect(log).toHaveLength(2);
    expect(log[0].engineUsed).toBe('bkt');
    expect(log[1].engineUsed).toBe('transformer');
  });
});
