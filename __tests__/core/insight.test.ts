import { generateInsight } from '../../src/core/destiny-matrix/insight';

test('generateInsight › is deterministic for the same input (no randomness)', () => {
  // mock Math.random agar selalu memilih template pertama dan opening pertama
  const originalRandom = Math.random;
  Math.random = jest.fn(() => 0);
  
  const first = generateInsight(matrix);
  const second = generateInsight(matrix);
  
  expect(first.narrative).toBe(second.narrative);
  expect(first.dominantElement).toBe(second.dominantElement);
  
  // restore
  Math.random = originalRandom;
}); 