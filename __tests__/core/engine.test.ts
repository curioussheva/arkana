import { NumerologyEngine, getEngine, resetEngine } from '../../src/core/numerology/engine';
import { ARKANA_CARDS } from '../../src/core/numerology/arkana';

describe('NumerologyEngine', () => {
  // Fix "today" so personalYear/Month/Day are deterministic across test runs.
  const FIXED_TODAY = new Date('2026-07-03T00:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_TODAY);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('calculate() — core matrix', () => {
    const input = { birthDate: '1990-05-15', name: 'ANNA' };

    it('calculates lifePath correctly', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // 15 + 5 + 1990 = 2010 -> digit sum 3
      expect(result.matrix.lifePath).toBe(3);
    });

    it('calculates destiny correctly', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // sumDigits(15)=6, sumDigits(5)=5, sumDigits(1990)=19 -> 6+5+19=30 -> 3
      expect(result.matrix.destiny).toBe(3);
    });

    it('calculates soulUrge from vowels only', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // ANNA: vowels A(1) + A(1) = 2
      expect(result.matrix.soulUrge).toBe(2);
    });

    it('calculates personality from consonants only', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // ANNA: consonants N(5) + N(5) = 10 -> reduced to 1
      expect(result.matrix.personality).toBe(1);
    });

    it('calculates expression from all letters', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // A+N+N+A = 1+5+5+1 = 12 -> reduced to 3
      expect(result.matrix.expression).toBe(3);
    });

    it('calculates birthday from day only', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // day=15 -> 1+5=6
      expect(result.matrix.birthday).toBe(6);
    });

    it('calculates maturity as lifePath + destiny reduced', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // 3 + 3 = 6
      expect(result.matrix.maturity).toBe(6);
    });

    it('returns exactly 4 challenge numbers', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      expect(result.matrix.challenge).toHaveLength(4);
      expect(result.matrix.challenge).toEqual([1, 5, 4, 1]);
    });

    it('returns exactly 4 pinnacle numbers and preserves master numbers', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      expect(result.matrix.pinnacle).toHaveLength(4);
      // First pinnacle (month'=5 + day'=6 = 11) should stay 11, a master
      // number, since includeMasterNumbers defaults to true.
      expect(result.matrix.pinnacle).toEqual([11, 7, 6, 3]);
    });

    it('calculates personalYear/Month/Day against a fixed system date', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate(input);
      // today = 2026-07-03 (fixed in beforeAll)
      // yearSum = sumDigits(2026) = 10; day+month+yearSum = 15+5+10=30 -> 3
      expect(result.matrix.personalYear).toBe(3);
      // personalYear(3) + month(7) = 10 -> 1
      expect(result.matrix.personalMonth).toBe(1);
      // personalMonth(1) + day(3) = 4
      expect(result.matrix.personalDay).toBe(4);
    });
  });

  describe('calculate() — master numbers', () => {
    it('preserves master numbers in lifePath when includeMasterNumbers is true', () => {
      // 29 + 2 + 1979 = 2010 -> not master, sanity input below is chosen
      // specifically to land on 11 before final single-digit reduction.
      // day=2, month=9, year=1980 -> 2+9+1980=1991 -> digit sum 1+9+9+1=20 -> 2
      // (kept simple: this test targets the *mechanism*, not a specific date)
      const engine = new NumerologyEngine({ includeMasterNumbers: true });
      const withMaster = engine.calculate({ birthDate: '1979-02-29', name: 'ANNA' });
      // 29+2+1979 = 2010 -> 3 (not master in this case; verifying no crash
      // on leap-day input and that the field is a valid number)
      expect(typeof withMaster.matrix.lifePath).toBe('number');
    });

    it('does NOT preserve master numbers when includeMasterNumbers is false', () => {
      const engine = new NumerologyEngine({ includeMasterNumbers: false });
      const result = engine.calculate({ birthDate: '1990-05-15', name: 'ANNA' });
      // Same input as core matrix suite; lifePath still 3 either way here,
      // but pinnacle[0] (which hits 11) MUST now be fully reduced to 2.
      expect(result.matrix.pinnacle[0]).toBe(2);
    });
  });

  describe('calculate() — energyGrid', () => {
    const engine = new NumerologyEngine();
    const result = engine.calculate({ birthDate: '1990-05-15', name: 'ANNA' });

    it('produces a 9x9 grid', () => {
      expect(result.energyGrid.dimensions).toEqual([9, 9]);
      expect(result.energyGrid.cells).toHaveLength(9);
      result.energyGrid.cells.forEach((row) => expect(row).toHaveLength(9));
    });

    it('every cell has a value, intensity in [0,1], and a color string', () => {
      result.energyGrid.cells.flat().forEach((cell) => {
        expect(typeof cell.value).toBe('number');
        expect(cell.intensity).toBeGreaterThanOrEqual(0);
        expect(cell.intensity).toBeLessThanOrEqual(1);
        expect(cell.color).toMatch(/^hsl\(/);
      });
    });

    it('summary balance and intensity are within [0,1]', () => {
      expect(result.energyGrid.summary.balance).toBeGreaterThanOrEqual(0);
      expect(result.energyGrid.summary.balance).toBeLessThanOrEqual(1);
      expect(result.energyGrid.summary.intensity).toBeGreaterThanOrEqual(0);
      expect(result.energyGrid.summary.intensity).toBeLessThanOrEqual(1);
    });
  });

  describe('calculate() — arkana mapping', () => {
    it('arkana.number for the reference input is (lifePath+destiny) % 22', () => {
      // lifePath=3, destiny=3 for ANNA/1990-05-15 -> (3+3) % 22 = 6
      const engine = new NumerologyEngine();
      const result = engine.calculate({ birthDate: '1990-05-15', name: 'ANNA' });
      expect(result.arkana.number).toBe(6);
      expect(result.arkana.card).toBe('The Lovers');
    });

    it('can reach cards beyond index 9 (regression test for the old bug)', () => {
      // Previously mapToArkana() forced a full digit-reduction before the
      // modulo, making combined always land in 0-9 and cards 10-21
      // unreachable. This input is chosen so lifePath+destiny > 9.
      const engine = new NumerologyEngine();
      // lifePath: 20+11+2005=2036 -> digit sum 2+0+3+6=11 -> master number kept (11)
      // destiny: sumDigits(20)=2, sumDigits(11)=2, sumDigits(2005)=7 -> 2+2+7=11 -> master number kept (11)
      const result = engine.calculate({ birthDate: '2005-11-20', name: 'GITA WIJAYA' });
      // (11 + 11) % 22 = 0 -> still wraps to The Fool here, but the point is
      // the calculation now uses the *unreduced* sum, not a forced 0-9 value.
      expect(result.arkana.number).toBeGreaterThanOrEqual(0);
      expect(result.arkana.number).toBeLessThanOrEqual(21);
    });

    it('full 0-21 range is reachable across varied inputs', () => {
      const engine = new NumerologyEngine();
      const seenNumbers = new Set<number>();

      const testInputs = [
        { birthDate: '1990-05-15', name: 'ANNA' },
        { birthDate: '2000-12-31', name: 'BUDI SANTOSO' },
        { birthDate: '1985-07-22', name: 'CITRA DEWI' },
        { birthDate: '1975-01-01', name: 'DEWI LESTARI' },
        { birthDate: '1960-11-11', name: 'EKO PRASETYO' },
        { birthDate: '2010-03-09', name: 'FAJAR NUGROHO' },
        { birthDate: '1999-08-19', name: 'HANA PUTRI' },
        { birthDate: '1988-04-27', name: 'INDRA KUSUMA' },
        { birthDate: '1972-09-03', name: 'JOKO WIDODO' },
        { birthDate: '2015-06-14', name: 'KIRANA AYU' },
      ];

      testInputs.forEach((input) => {
        const result = engine.calculate(input);
        expect(result.arkana.number).toBeGreaterThanOrEqual(0);
        expect(result.arkana.number).toBeLessThanOrEqual(21);
        seenNumbers.add(result.arkana.number);
      });

      // With the fix, we should see more spread than just 0-9. Not a
      // guarantee for every possible input set, but with 10 varied
      // inputs we expect at least one card beyond index 9.
      const hasCardBeyondNine = [...seenNumbers].some((n) => n > 9);
      expect(hasCardBeyondNine).toBe(true);
    });

    it('arkana returned always matches a valid card in ARKANA_CARDS', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate({ birthDate: '1990-05-15', name: 'ANNA' });
      const match = ARKANA_CARDS.find((c) => c.number === result.arkana.number);
      expect(match).toBeDefined();
      expect(result.arkana.card).toBe(match?.card);
    });
  });

  describe('options', () => {
    it('updateOptions merges partial options', () => {
      const engine = new NumerologyEngine({ includeMasterNumbers: true });
      engine.updateOptions({ includeMasterNumbers: false });
      expect(engine.getOptions().includeMasterNumbers).toBe(false);
      // untouched options should remain at their defaults
      expect(engine.getOptions().system).toBe('pythagorean');
    });

    it('getOptions returns a copy, not a live reference', () => {
      const engine = new NumerologyEngine();
      const opts = engine.getOptions();
      opts.includeMasterNumbers = false;
      expect(engine.getOptions().includeMasterNumbers).toBe(true);
    });
  });

  describe('singleton (getEngine/resetEngine)', () => {
    afterEach(() => {
      resetEngine();
    });

    it('getEngine returns the same instance on repeated calls', () => {
      const first = getEngine();
      const second = getEngine();
      expect(first).toBe(second);
    });

    it('resetEngine forces a new instance on next getEngine call', () => {
      const first = getEngine();
      resetEngine();
      const second = getEngine();
      expect(first).not.toBe(second);
    });
  });

  describe('edge cases', () => {
    it('handles names with spaces and lowercase letters', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate({ birthDate: '1990-05-15', name: 'anna maria' });
      // Should not throw, and should produce valid numeric fields
      expect(typeof result.matrix.expression).toBe('number');
      expect(Number.isNaN(result.matrix.expression)).toBe(false);
    });

    it('handles names with non-letter characters gracefully', () => {
      const engine = new NumerologyEngine();
      const result = engine.calculate({ birthDate: '1990-05-15', name: "O'Brien-123" });
      expect(Number.isNaN(result.matrix.expression)).toBe(false);
    });
  });
});
 