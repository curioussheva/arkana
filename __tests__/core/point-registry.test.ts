// __tests__/core/point-registry.test.ts
//
// Guard: kalau suatu saat ada yang menambahkan formula paralel lagi
// (seperti kasus N/O/P vs LM_Center/Money/Love kemarin), test ini
// gagal duluan sebelum sempat jadi bug produksi.

import { DestinyMatrixEngine } from '../../src/core/destiny-matrix/engine';
import { ALIAS_TO_CANONICAL, resolvePoint } from '../../src/core/destiny-matrix/point-registry';

describe('Point Registry — konsistensi alias vs canonical', () => {
  // Pakai jalur produksi asli (DestinyMatrixEngine.calculate), bukan
  // calculate37PointsMatrix mentah — supaya test ini merefleksikan
  // persis apa yang dikonsumsi UI/consumer lain, termasuk destinies
  // dan namedLines yang dibangun di atas points.
  const engine = new DestinyMatrixEngine();
  const matrix = engine.calculate({ birthDate: '1983-08-12' });

  Object.entries(ALIAS_TO_CANONICAL).forEach(([alias, canonical]) => {
    // Lewati alias yang murni kosmetik & memang sengaja sama key
    // (mis. 'A' -> 'A'); yang penting diuji adalah alias BEDA NAMA.
    if (alias === canonical) return;

    test(`alias "${alias}" harus identik dengan canonical "${canonical}"`, () => {
      const aliasPoint = resolvePoint(matrix, alias) as { value?: number } | undefined;
      const canonicalPoint = matrix.points[canonical] as { value?: number } | undefined;

      expect(aliasPoint).toBeDefined();
      expect(canonicalPoint).toBeDefined();
      expect(aliasPoint?.value).toBe(canonicalPoint?.value);
    });
  });
});
 