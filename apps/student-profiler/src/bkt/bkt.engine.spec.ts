import { BKTEngine } from './bkt.engine';
import { BKTState } from '@cognilingua/shared';

describe('BKTEngine', () => {
  let engine: BKTEngine;

  beforeEach(() => {
    engine = new BKTEngine();
  });

  it('deve inicializar o estado com pKnown igual a pLo', () => {
    const state = engine.initializeState(0.3, 0.1, 0.2, 0.05);

    expect(state).toEqual<BKTState>({
      pLo: 0.3,
      pG: 0.1,
      pS: 0.2,
      pT: 0.05,
      pKnown: 0.3,
    });
  });

  it('deve atualizar o estado após resposta correta', () => {
    const state: BKTState = {
      pLo: 0.2,
      pG: 0.1,
      pS: 0.2,
      pT: 0.1,
      pKnown: 0.2,
    };

    const updated = engine.updateKnowledgeState(state, true);

    expect(updated.pKnown).toBeCloseTo(2 / 3, 4); // ≈0.6667
    expect(updated.pLo).toBeCloseTo(0.7, 4);
    expect(updated.pG).toBe(state.pG);
    expect(updated.pS).toBe(state.pS);
    expect(updated.pT).toBe(state.pT);
  });

  it('deve atualizar o estado após resposta errada', () => {
    const state: BKTState = {
      pLo: 0.7,
      pG: 0.1,
      pS: 0.2,
      pT: 0.05,
      pKnown: 0.7,
    };

    const updated = engine.updateKnowledgeState(state, false);

    expect(updated.pKnown).toBeCloseTo(0.341463, 4);
    expect(updated.pLo).toBeCloseTo(0.374389, 4);
  });

  it('não deve gerar NaN quando o denominador é zero', () => {
    const state: BKTState = {
      pLo: 0,
      pG: 0,
      pS: 0,
      pT: 0.2,
      pKnown: 0,
    };

    const updated = engine.updateKnowledgeState(state, true);

    expect(updated.pKnown).toBe(0);
    expect(updated.pLo).toBeCloseTo(state.pT);
  });
});
