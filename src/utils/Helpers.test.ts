import { describe, expect, it } from 'vitest';
import { getBaseUrl } from './Helpers';

describe('Helpers', () => {
  describe('Base URL resolver', () => {
    it('returns default development host when environment is unconfigured', () => {
      expect(getBaseUrl()).toBe('http://localhost:3000');
    });
  });
});
