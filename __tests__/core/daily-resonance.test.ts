// __tests__/core/daily-resonance.test.ts
import { getDailyResonance, getDailyElementSummary } from '@core/destiny-matrix/daily-resonance';
import type { ArcanaDefinition } from '@core/arcana/types';

// Mock getRandomDailyCard supaya test deterministic, tidak bergantung tanggal hari ini
jest.mock('@core/destiny-matrix/daily-card', () => ({
  getRandomDailyCard: jest.fn(),
}));

import { getRandomDailyCard } from '@core/destiny-matrix/daily-card';

const mockGetRandomDailyCard = getRandomDailyCard as jest.MockedFunction<typeof getRandomDailyCard>;

// Helper bikin kartu palsu minimal sesuai kebutuhan daily-resonance.ts
function makeMockCard(overrides: Partial<ArcanaDefinition>): ArcanaDefinition {
  return {
    id: 1,
    tarotName: 'The Magician',
    element: 'Fire',
    ...overrides,
  } as ArcanaDefinition;
}

describe('daily-resonance', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDailyResonance — pemetaan totem tetramorph', () => {
    it('Fire → totemKey Lion', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Fire', id: 8, tarotName: 'Strength' }));
      const result = getDailyResonance();
      expect(result.totemKey).toBe('Lion');
      expect(result.element).toContain('Api');
    });

    it('Water → totemKey Eagle', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Water', id: 2, tarotName: 'The High Priestess' }));
      const result = getDailyResonance();
      expect(result.totemKey).toBe('Eagle');
      expect(result.element).toContain('Air (Water)');
    });

    it('Air → totemKey Angel', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Air', id: 1, tarotName: 'The Magician' }));
      const result = getDailyResonance();
      expect(result.totemKey).toBe('Angel');
      expect(result.element).toContain('Udara');
    });

    it('Earth → totemKey Ox', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Earth', id: 4, tarotName: 'The Emperor' }));
      const result = getDailyResonance();
      expect(result.totemKey).toBe('Ox');
      expect(result.element).toContain('Bumi');
    });

    it('membawa cardName dan cardId dari kartu harian', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Fire', id: 8, tarotName: 'Strength' }));
      const result = getDailyResonance();
      expect(result.cardName).toBe('Strength');
      expect(result.cardId).toBe(8);
    });

    it('mengonversi id 0 (The Fool) menjadi 22 sesuai konvensi app', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Air', id: 0, tarotName: 'The Fool' }));
      const result = getDailyResonance();
      expect(result.cardId).toBe(22);
    });
  });

  describe('getDailyElementSummary — versi ringkas', () => {
    it('totemKey konsisten dengan versi lengkap (getDailyResonance)', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Fire', id: 8, tarotName: 'Strength' }));
      const full = getDailyResonance();
      const summary = getDailyElementSummary();
      expect(summary.totemKey).toBe(full.totemKey);
      expect(summary.cardId).toBe(full.cardId);
    });

    it('mengembalikan nama elemen singkat (bukan bilingual penuh)', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: 'Earth', id: 4, tarotName: 'The Emperor' }));
      const summary = getDailyElementSummary();
      expect(summary.name).toBe('Bumi');
    });
  });

  describe('Fallback — saat getRandomDailyCard gagal atau kartu null', () => {
    it('fallback ke Fire/Magician saat getRandomDailyCard melempar error', () => {
      mockGetRandomDailyCard.mockImplementation(() => {
        throw new Error('DB error');
      });
      const result = getDailyResonance();
      expect(result.cardName).toBe('The Magician');
      expect(result.cardId).toBe(1);
      expect(result.totemKey).toBe('Lion'); // Fire → Lion
    });

    it('fallback ke Fire/Magician saat getRandomDailyCard return null', () => {
      mockGetRandomDailyCard.mockReturnValue(null as unknown as ArcanaDefinition);
      const result = getDailyResonance();
      expect(result.cardName).toBe('The Magician');
      expect(result.totemKey).toBe('Lion');
    });

    it('fallback ke Fire jika arcana.element tidak dikenal/undefined', () => {
      mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element: undefined as unknown as string, id: 5, tarotName: 'The Hierophant' }));
      const result = getDailyResonance();
      expect(result.totemKey).toBe('Lion'); // default Fire
    });
  });

  describe('Konsistensi mapping tetramorph (regression guard)', () => {
    // Test ini sengaja eksplisit mendaftar SEMUA 4 pasangan sekaligus,
    // supaya kalau ada yang tanpa sengaja diubah lagi di masa depan
    // (seperti insiden sebelumnya: Eagle sempat mewakili Fire, bukan Water),
    // test ini langsung merah dan ketauan.
    const EXPECTED_MAPPING: Record<string, string> = {
      Fire: 'Lion',
      Water: 'Eagle',
      Air: 'Angel',
      Earth: 'Ox',
    };

    Object.entries(EXPECTED_MAPPING).forEach(([element, expectedTotem]) => {
      it(`${element} harus selalu memetakan ke totem ${expectedTotem}`, () => {
        mockGetRandomDailyCard.mockReturnValue(makeMockCard({ element, id: 1, tarotName: 'Test Card' }));
        expect(getDailyResonance().totemKey).toBe(expectedTotem);
      });
    });
  });
});