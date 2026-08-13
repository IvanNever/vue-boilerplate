import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './apiClient';

function withFakeAdapter() {
  let capturedConfig: InternalAxiosRequestConfig | undefined;

  apiClient.defaults.adapter = (config: InternalAxiosRequestConfig) => {
    capturedConfig = config;
    return Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    } as AxiosResponse);
  };

  return { getCapturedConfig: () => capturedConfig };
}

function withRejectingAdapter(status: number) {
  apiClient.defaults.adapter = () => Promise.reject({ response: { status } });
}

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    apiClient.defaults.adapter = undefined;
  });

  describe('request interceptor', () => {
    it('attaches a Bearer token when one is stored', async () => {
      localStorage.setItem('token', 'abc123');
      const { getCapturedConfig } = withFakeAdapter();

      await apiClient.get('/resource');

      expect(getCapturedConfig()?.headers.Authorization).toBe(
        'Bearer abc123'
      );
    });

    it('omits the Authorization header when no token is stored', async () => {
      const { getCapturedConfig } = withFakeAdapter();

      await apiClient.get('/resource');

      expect(getCapturedConfig()?.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('passes successful responses through unchanged', async () => {
      withFakeAdapter();

      const res = await apiClient.get('/resource');

      expect(res.status).toBe(200);
    });

    it('clears the stored token and redirects to /login on a 403 response', async () => {
      localStorage.setItem('token', 'abc123');
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { origin: 'http://localhost', href: '' }
      });

      try {
        withRejectingAdapter(403);

        await expect(apiClient.get('/resource')).rejects.toBeTruthy();

        expect(localStorage.getItem('token')).toBeNull();
        expect(window.location.href).toBe('http://localhost/login');
      } finally {
        Object.defineProperty(window, 'location', {
          configurable: true,
          value: originalLocation
        });
      }
    });

    it('leaves the stored token untouched on non-403 errors', async () => {
      localStorage.setItem('token', 'abc123');
      withRejectingAdapter(500);

      await expect(apiClient.get('/resource')).rejects.toBeTruthy();

      expect(localStorage.getItem('token')).toBe('abc123');
    });
  });
});
