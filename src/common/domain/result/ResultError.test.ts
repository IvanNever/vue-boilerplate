import { describe, expect, it } from 'vitest';
import { ResultError } from './ResultError';

describe('ResultError', () => {
  it('stores code and optional description', () => {
    const error = new ResultError('E_CODE', 'description');
    expect(error.code).toBe('E_CODE');
    expect(error.description).toBe('description');
  });

  describe('equals', () => {
    it('returns true for the same instance', () => {
      const error = new ResultError('E_CODE');
      expect(error.equals(error)).toBe(true);
    });

    it('returns true when codes match, regardless of description', () => {
      const a = new ResultError('E_CODE', 'first');
      const b = new ResultError('E_CODE', 'second');
      expect(a.equals(b)).toBe(true);
    });

    it('returns false when codes differ', () => {
      const a = new ResultError('E_CODE_A');
      const b = new ResultError('E_CODE_B');
      expect(a.equals(b)).toBe(false);
    });
  });
});
