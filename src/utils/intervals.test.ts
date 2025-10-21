import { describe, expect, it } from 'vitest';
import { centsBetween, intervalList } from './intervals';

describe('interval utilities', () => {
  it('contains 13 interwałów', () => {
    expect(intervalList).toHaveLength(13);
  });

  it('centsBetween zwraca 1200 centów dla oktawy', () => {
    const cents = centsBetween(440, 880);
    expect(Math.round(cents)).toBe(1200);
  });
});
