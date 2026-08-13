import { describe, expect, it, beforeEach } from 'vitest';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiCoreImpl } from './ApiCore';

function withFakeAdapter(apiCore: ApiCoreImpl) {
  const instance = apiCore.getInst();
  let capturedConfig: InternalAxiosRequestConfig | undefined;

  instance.defaults.adapter = (config: InternalAxiosRequestConfig) => {
    capturedConfig = config;
    return Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    } as AxiosResponse);
  };

  return { instance, getCapturedConfig: () => capturedConfig };
}

function withRejectingAdapter(apiCore: ApiCoreImpl, status: number) {
  const instance = apiCore.getInst();

  instance.defaults.adapter = () =>
    Promise.reject({ response: { status } });

  return instance;
}

describe('ApiCoreImpl', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('request interceptor', () => {
    it('attaches a Bearer token when one is stored', async () => {
      localStorage.setItem('token', 'abc123');
      const { instance, getCapturedConfig } = withFakeAdapter(
        new ApiCoreImpl()
      );

      await instance.get('/resource');

      expect(getCapturedConfig()?.headers.Authorization).toBe(
        'Bearer abc123'
      );
    });

    it('omits the Authorization header when no token is stored', async () => {
      const { instance, getCapturedConfig } = withFakeAdapter(
        new ApiCoreImpl()
      );

      await instance.get('/resource');

      expect(getCapturedConfig()?.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('passes successful responses through unchanged', async () => {
      const { instance } = withFakeAdapter(new ApiCoreImpl());

      const res = await instance.get('/resource');

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
        const instance = withRejectingAdapter(new ApiCoreImpl(), 403);

        await expect(instance.get('/resource')).rejects.toBeTruthy();

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
      const instance = withRejectingAdapter(new ApiCoreImpl(), 500);

      await expect(instance.get('/resource')).rejects.toBeTruthy();

      expect(localStorage.getItem('token')).toBe('abc123');
    });
  });
});
