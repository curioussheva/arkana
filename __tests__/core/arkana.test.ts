import { ARKANA_CARDS, getArkanaByNumber, getArkanaByName } from '../../src/core/numerology/arkana';

describe('ARKANA_CARDS data integrity', () => {
  it('contains exactly 22 cards (Major Arcana)', () => {
    expect(ARKANA_CARDS).toHaveLength(22);
  });

  it('has sequential numbers from 0 to 21 matching array index', () => {
    ARKANA_CARDS.forEach((card, index) => {
      expect(card.number).toBe(index);
    });
  });

  it('every card has all required ArkanaInfo fields non-empty', () => {
    ARKANA_CARDS.forEach((card) => {
      expect(card.card.length).toBeGreaterThan(0);
      expect(['Fire', 'Water', 'Air', 'Earth']).toContain(card.element);
      expect(card.keywords.length).toBeGreaterThan(0);
      expect(card.uprightMeaning.length).toBeGreaterThan(0);
      expect(card.reversedMeaning.length).toBeGreaterThan(0);
    });
  });

  it('has no duplicate card names', () => {
    const names = ARKANA_CARDS.map((c) => c.card);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('getArkanaByNumber', () => {
  it('returns the correct card for a valid index', () => {
    expect(getArkanaByNumber(0).card).toBe('The Fool');
    expect(getArkanaByNumber(21).card).toBe('The World');
  });

  it('wraps positive numbers larger than 21 via modulo', () => {
    expect(getArkanaByNumber(22).card).toBe('The Fool');
    expect(getArkanaByNumber(23).card).toBe('The Magician');
  });

  it('wraps negative numbers correctly (no negative-index crash)', () => {
    // ((-1 % 22) + 22) % 22 = 21
    expect(getArkanaByNumber(-1).card).toBe('The World');
  });
});

describe('getArkanaByName', () => {
  it('finds a card case-insensitively', () => {
    expect(getArkanaByName('the fool')?.number).toBe(0);
    expect(getArkanaByName('THE WORLD')?.number).toBe(21);
  });

  it('returns undefined for a non-existent card name', () => {
    expect(getArkanaByName('The Banker')).toBeUndefined();
  });
});
