import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import router from './index';

describe('router beforeEach guard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('redirects unauthenticated visitors to the login page', async () => {
    await router.push({ name: 'dashboard' });
    expect(router.currentRoute.value.name).toBe('login-page');
  });

  it('lets an authenticated visitor reach a protected page', async () => {
    localStorage.setItem('token', 'valid-token');
    await router.push({ name: 'dashboard' });
    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('redirects an authenticated visitor away from the login page', async () => {
    localStorage.setItem('token', 'valid-token');
    await router.push({ name: 'login-page' });
    expect(router.currentRoute.value.name).toBe('dashboard');
  });
});
