import { getDestinyMatrixEngine } from '../../src/core/destiny-matrix/engine';
import { generateInsight } from '../../src/core/destiny-matrix/insight';

test('generateInsight › is deterministic for the same input (no randomness)', () => {
  // mock Math.random agar selalu memilih template/opening pertama
  const originalRandom = Math.random;
  Math.random = jest.fn(() => 0);

  const engine = getDestinyMatrixEngine();
  const matrix = engine.calculate({ birthDate: '1990-05-15' });

  const first = generateInsight(matrix);
  const second = generateInsight(matrix);

  // narrative adalah objek (bukan string) — bandingkan struktur, bukan referensi
  expect(first.narrative).toEqual(second.narrative);
  expect(first.elements.stats.dominant).toBe(second.elements.stats.dominant);

  Math.random = originalRandom;
});