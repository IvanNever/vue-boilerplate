import { describe, expect, it, vi, beforeEach } from 'vitest';
import { userDtoFixture } from '@/infrastructure/test-utils/fixtures/userDtoFixture';
import { UsersRepoImpl } from './usersRepoImpl';

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }));

vi.mock('@/infrastructure/api/apiClient', () => ({
  apiClient: { get: getMock }
}));

describe('UsersRepoImpl', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('fetches users and maps DTOs to domain entities', async () => {
    getMock.mockResolvedValue({
      data: [userDtoFixture({ id: 1 }), userDtoFixture({ id: 2 })]
    });

    const users = await new UsersRepoImpl().getUsers();

    expect(users).toHaveLength(2);
    expect(users.map((user) => user.id)).toEqual([1, 2]);
  });

  it('requests the users endpoint under VITE_API_BASE_URL', async () => {
    getMock.mockResolvedValue({ data: [] });

    await new UsersRepoImpl().getUsers();

    expect(getMock).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_BASE_URL}/users`
    );
  });
});
