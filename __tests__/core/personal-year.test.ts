import { calculatePersonalYearArcana } from '../../src/core/destiny-matrix/personal-year';

describe('calculatePersonalYearArcana', () => {
  it('1983-08-12 for year 2026: requires one reduction pass (30 -> 3)', () => {
    // day=12 (unchanged, <=22), month=8 (unchanged), year 2026 digit-sum=10
    // 12 + 8 + 10 = 30 -> reduceToArcana(30) = (30%10)+(30/10)=0+3=3
    const result = calculatePersonalYearArcana('1983-08-12', 2026);
    expect(result.universalYearValue).toBe(10);
    expect(result.personalYearValue).toBe(3);
    expect(result.arcana.card).toBe('The Empress');
  });

  it('1987-01-07 for year 2026: no reduction pass needed (sum stays <=22)', () => {
    // day=7, month=1, year 2026 digit-sum=10
    // 7 + 1 + 10 = 18 (already <=22, no reduction)
    const result = calculatePersonalYearArcana('1987-01-07', 2026);
    expect(result.universalYearValue).toBe(10);
    expect(result.personalYearValue).toBe(18);
    expect(result.arcana.card).toBe('The Moon');
  });

  it('defaults to the current year when no year argument is given', () => {
    const result = calculatePersonalYearArcana('1990-05-15');
    expect(result.year).toBe(new Date().getFullYear());
  });

  it('always returns a value within the valid 1-22 range', () => {
    const testCases = [
      { birthDate: '2000-12-31', year: 2030 },
      { birthDate: '1975-01-01', year: 2099 },
      { birthDate: '1960-11-11', year: 1999 },
    ];

    testCases.forEach(({ birthDate, year }) => {
      const result = calculatePersonalYearArcana(birthDate, year);
      expect(result.personalYearValue).toBeGreaterThanOrEqual(1);
      expect(result.personalYearValue).toBeLessThanOrEqual(22);
      expect(result.arcana.card.length).toBeGreaterThan(0);
    });
  });
});
