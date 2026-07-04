import { DestinyMatrixEngine, getDestinyMatrixEngine, resetDestinyMatrixEngine } from '../../src/core/destiny-matrix/engine';

describe('DestinyMatrixEngine', () => {
  describe('calculate() — verified against documented worked example (1987-01-07)', () => {
    // Reference values from a published Destiny Matrix calculation guide:
    // A=7, B=1, C=7, D=15, E=3, F=8, G=8, H=22, I=22, J=10, K=4, L=10, M=18
    const engine = new DestinyMatrixEngine();
    const result = engine.calculate({ birthDate: '1987-01-07' });

    it('calculates primary points A, B, C', () => {
      expect(result.points.A.value).toBe(7);
      expect(result.points.B.value).toBe(1);
      expect(result.points.C.value).toBe(7);
    });

    it('calculates synthesis points D and E', () => {
      expect(result.points.D.value).toBe(15);
      expect(result.points.E.value).toBe(3);
    });

    it('calculates corner points F, G, H, I (including exact-22 edge case)', () => {
      expect(result.points.F.value).toBe(8);
      expect(result.points.G.value).toBe(8);
      expect(result.points.H.value).toBe(22); // exactly 22 — must NOT reduce further
      expect(result.points.I.value).toBe(22);
    });

    it('calculates inner points J, K, L, M', () => {
      expect(result.points.J.value).toBe(10);
      expect(result.points.K.value).toBe(4);
      expect(result.points.L.value).toBe(10);
      expect(result.points.M.value).toBe(18);
    });
  });

  describe('calculate() — second reference date (1983-08-12)', () => {
    const engine = new DestinyMatrixEngine();
    const result = engine.calculate({ birthDate: '1983-08-12' });

    it('matches hand-verified values for all 13 points', () => {
      // day=12, month=8, year digit-sum=1+9+8+3=21
      expect(result.points.A.value).toBe(12);
      expect(result.points.B.value).toBe(8);
      expect(result.points.C.value).toBe(21);
      expect(result.points.D.value).toBe(5); // (12+8+21=41 -> 4+1=5)
      expect(result.points.E.value).toBe(10); // (12+8+21+5=46 -> 4+6=10)
      expect(result.points.F.value).toBe(20); // (12+8=20)
      expect(result.points.G.value).toBe(11); // (8+21=29 -> 2+9=11)
      expect(result.points.H.value).toBe(8); // (21+5=26 -> 2+6=8)
      expect(result.points.I.value).toBe(17); // (5+12=17)
      expect(result.points.J.value).toBe(22); // (12+10=22, exact)
      expect(result.points.K.value).toBe(18); // (8+10=18)
      expect(result.points.L.value).toBe(4); // (21+10=31 -> 3+1=4)
      expect(result.points.M.value).toBe(15); // (5+10=15)
    });
  });

  describe('arcana mapping', () => {
    it('maps value 22 to The Fool (Destiny Matrix numbering shifts Fool to 22)', () => {
      const engine = new DestinyMatrixEngine();
      const result = engine.calculate({ birthDate: '1987-01-07' });
      expect(result.points.H.value).toBe(22);
      expect(result.points.H.arcana.card).toBe('The Fool');
    });

    it('maps value 1 to The Magician', () => {
      const engine = new DestinyMatrixEngine();
      const result = engine.calculate({ birthDate: '1987-01-07' });
      expect(result.points.B.value).toBe(1);
      expect(result.points.B.arcana.card).toBe('The Magician');
    });

    it('every point has a valid, non-empty arcana card', () => {
      const engine = new DestinyMatrixEngine();
      const result = engine.calculate({ birthDate: '1990-05-15' });
      Object.values(result.points).forEach((point) => {
        expect(point.arcana.card.length).toBeGreaterThan(0);
        expect(point.value).toBeGreaterThanOrEqual(1);
        expect(point.value).toBeLessThanOrEqual(22);
      });
    });
  });

  describe('singleton (getDestinyMatrixEngine/resetDestinyMatrixEngine)', () => {
    afterEach(() => {
      resetDestinyMatrixEngine();
    });

    it('returns the same instance on repeated calls', () => {
      const first = getDestinyMatrixEngine();
      const second = getDestinyMatrixEngine();
      expect(first).toBe(second);
    });

    it('resetDestinyMatrixEngine forces a new instance', () => {
      const first = getDestinyMatrixEngine();
      resetDestinyMatrixEngine();
      const second = getDestinyMatrixEngine();
      expect(first).not.toBe(second);
    });
  });
});
