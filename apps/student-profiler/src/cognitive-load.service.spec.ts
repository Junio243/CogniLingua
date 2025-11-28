import { calculateCognitiveLoad } from './cognitive-load.service';

describe('calculateCognitiveLoad', () => {
  afterEach(() => {
    delete process.env.COGNITIVE_LOAD_LOW_MAX;
    delete process.env.COGNITIVE_LOAD_MEDIUM_MAX;
    jest.resetModules();
  });

  it('respeita limites configurados no .env e retorna low/medium/high', async () => {
    process.env.COGNITIVE_LOAD_LOW_MAX = '0.4';
    process.env.COGNITIVE_LOAD_MEDIUM_MAX = '0.7';

    jest.isolateModules(() => {
      const { calculateCognitiveLoad: isolated } = require('./cognitive-load.service');

      expect(isolated('alice')).toMatchObject({ level: 'low', thresholds: { lowMax: 0.4, mediumMax: 0.7 } });
      expect(isolated('threshold-low')).toMatchObject({ level: 'medium' });
      expect(isolated('zzzz')).toMatchObject({ level: 'high' });
    });
  });

  it('lança erro quando studentId é vazio', () => {
    expect(() => calculateCognitiveLoad('')).toThrow('studentId is required');
  });
});
