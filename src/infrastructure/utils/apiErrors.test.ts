import { describe, expect, it } from 'vitest';
import { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { apiErrors } from './apiErrors';

function axiosErrorWithStatus(status: number): AxiosError {
  const error = new AxiosError('Request failed');
  error.response = {
    status,
    statusText: '',
    headers: {},
    config: {},
    data: undefined
  } as unknown as AxiosResponse;
  return error;
}

describe('apiErrors', () => {
  it('returns the string unchanged when given a plain string', () => {
    expect(apiErrors('custom message')).toBe('custom message');
  });

  it('maps known status codes to a user-facing message', () => {
    expect(apiErrors(axiosErrorWithStatus(401))).toContain('incorrect');
    expect(apiErrors(axiosErrorWithStatus(404))).toContain('not found');
    expect(apiErrors(axiosErrorWithStatus(500))).toContain('server');
  });

  it('falls back to a generic message for unmapped statuses', () => {
    expect(apiErrors(axiosErrorWithStatus(418))).toBe(
      'An unexpected error occurred. Please try again later.'
    );
  });

  it('falls back to a generic message for non-axios errors', () => {
    expect(apiErrors(new Error('boom'))).toBe(
      'An unexpected error occurred. Please try again later.'
    );
  });

  it('falls back to a generic message when the axios error has no response', () => {
    expect(apiErrors(new AxiosError('Network Error'))).toBe(
      'An unexpected error occurred. Please try again later.'
    );
  });
});
