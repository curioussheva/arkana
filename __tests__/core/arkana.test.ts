import { getArcanaByNumber, getArcanaByTarotName, getAllArcana } from '../../src/core/arcana';

describe('ARCANA_DATABASE data integrity', () => {
  const allArcana = getAllArcana();

  it('contains exactly 22 cards (Major Arcana)', () => {
    expect(allArcana).toHaveLength(22);
  });

  it('has sequential ids from 0 to 21', () => {
    const ids = allArcana.map((a) => a.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 22 }, (_, i) => i));
  });

  it('every card has all required fields non-empty', () => {
    allArcana.forEach((card) => {
      expect(card.tarotName.length).toBeGreaterThan(0);
      expect(['Fire', 'Water', 'Air', 'Earth']).toContain(card.element);
      expect(card.keywords.length).toBeGreaterThan(0);
      expect(card.uprightMeaning.length).toBeGreaterThan(0);
      expect(card.reversedMeaning.length).toBeGreaterThan(0);
    });
  });

  it('has no duplicate tarot names', () => {
    const names = allArcana.map((a) => a.tarotName);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('getArcanaByNumber', () => {
  it('returns the correct card for a valid index', () => {
    expect(getArcanaByNumber(0).tarotName).toBe('The Fool');
    expect(getArcanaByNumber(21).tarotName).toBe('The World');
  });

  it('wraps positive numbers larger than 21 via modulo', () => {
    expect(getArcanaByNumber(22).tarotName).toBe('The Fool');
    expect(getArcanaByNumber(23).tarotName).toBe('The Magician');
  });

  it('wraps negative numbers correctly (no negative-index crash)', () => {
    // ((-1 % 22) + 22) % 22 = 21
    expect(getArcanaByNumber(-1).tarotName).toBe('The World');
  });
});

describe('getArcanaByTarotName', () => {
  it('finds a card case-insensitively', () => {
    expect(getArcanaByTarotName('the fool')?.id).toBe(0);
    expect(getArcanaByTarotName('THE WORLD')?.id).toBe(21);
  });

  it('returns undefined for a non-existent card name', () => {
    expect(getArcanaByTarotName('The Banker')).toBeUndefined();
  });
}); 