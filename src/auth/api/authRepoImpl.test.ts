import { describe, expect, it, vi, beforeEach } from 'vitest';
import { userDtoFixture } from '@/infrastructure/test-utils/fixtures/userDtoFixture';
import { AuthRepoImpl } from './authRepoImpl';

const { postMock, getMock, patchMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
  getMock: vi.fn(),
  patchMock: vi.fn()
}));

vi.mock('@/infrastructure/context', () => ({
  publicContext: {
    get: () => ({
      getInst: () => ({ post: postMock, get: getMock, patch: patchMock })
    })
  }
}));

describe('AuthRepoImpl', () => {
  beforeEach(() => {
    postMock.mockReset();
    getMock.mockReset();
    patchMock.mockReset();
  });

  describe('signIn', () => {
    it('posts credentials and returns the token with the mapped user', async () => {
      postMock.mockResolvedValue({
        data: {
          token: 'jwt-token',
          user: userDtoFixture({ roles: [{ name: 'admin' }] })
        }
      });

      const result = await new AuthRepoImpl().signIn({
        email: 'a@b.com',
        password: 'secret'
      });

      expect(postMock).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/sign-in`,
        { email: 'a@b.com', password: 'secret' }
      );
      expect(result.token).toBe('jwt-token');
      expect(result.user.role).toBe('admin');
    });
  });

  describe('getCurrentUser', () => {
    it('fetches and maps the current user', async () => {
      getMock.mockResolvedValue({
        data: userDtoFixture({ roles: [{ name: 'viewer' }] })
      });

      const user = await new AuthRepoImpl().getCurrentUser();

      expect(getMock).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/current`
      );
      expect(user.role).toBe('viewer');
    });
  });

  describe('updateCurrentUserPassword', () => {
    it('patches the new password', async () => {
      patchMock.mockResolvedValue({});

      await new AuthRepoImpl().updateCurrentUserPassword('new-pass');

      expect(patchMock).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/password`,
        { password: 'new-pass' }
      );
    });
  });
});
