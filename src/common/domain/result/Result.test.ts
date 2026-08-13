import { describe, expect, it } from 'vitest';
import { Result } from './Result';
import { ResultError } from './ResultError';
import { AccessErrorsResultError } from './AccessErrorsResultError';
import { AccessesSuccessResultError } from './AccessesSuccessResultError';

describe('Result', () => {
  describe('success', () => {
    it('creates a successful result carrying a value', () => {
      const result = Result.success(42);
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe(42);
    });

    it('supports a void success', () => {
      const result = Result.success();
      expect(result.isSuccess).toBe(true);
    });

    it('throws when accessing errors on a success', () => {
      const result = Result.success(1);
      expect(() => result.errors).toThrow(AccessErrorsResultError);
    });
  });

  describe('failure', () => {
    it('creates a failed result carrying errors', () => {
      const error = new ResultError('E_CODE', 'description');
      const result = Result.failure(error);
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.errors).toEqual([error]);
    });

    it('supports multiple errors', () => {
      const e1 = new ResultError('E1');
      const e2 = new ResultError('E2');
      const result = Result.failure(e1, e2);
      expect(result.errors).toEqual([e1, e2]);
    });

    it('throws when accessing value on a failure', () => {
      const result = Result.failure(new ResultError('E_CODE'));
      expect(() => result.value).toThrow(AccessesSuccessResultError);
    });

    describe('includesError', () => {
      it('returns true when a matching error code is present', () => {
        const result = Result.failure(new ResultError('E_CODE'));
        expect(result.includesError(new ResultError('E_CODE'))).toBe(true);
      });

      it('returns false when no matching error code is present', () => {
        const result = Result.failure(new ResultError('E_CODE'));
        expect(result.includesError(new ResultError('OTHER'))).toBe(false);
      });

      it('throws when called on a success', () => {
        const result = Result.success(1);
        expect(() => result.includesError(new ResultError('E_CODE'))).toThrow(
          AccessErrorsResultError
        );
      });
    });
  });
});
