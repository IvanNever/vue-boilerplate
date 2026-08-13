import { describe, expect, it, vi, beforeEach } from 'vitest';
import { userFixture } from '@/infrastructure/test-utils/fixtures/userFixture';
import { useUsers } from './useUsers';

const { getUsersMock, showNotificationMock } = vi.hoisted(() => ({
  getUsersMock: vi.fn(),
  showNotificationMock: vi.fn()
}));

vi.mock('@/users/infrastructure/context', () => ({
  usersContext: {
    get: () => ({ getUsers: getUsersMock })
  }
}));

vi.mock('@/ui-kit/appNotification/useNotification', () => ({
  useNotification: () => ({ showNotification: showNotificationMock })
}));

describe('useUsers', () => {
  beforeEach(() => {
    getUsersMock.mockReset();
    showNotificationMock.mockReset();
    useUsers().users.value = [];
  });

  it('loads users from the repository', async () => {
    const user = userFixture({ id: 1 });
    getUsersMock.mockResolvedValue([user]);

    const { users, isLoading, getUsers } = useUsers();
    const pending = getUsers();

    expect(isLoading.value).toBe(true);
    await pending;

    expect(isLoading.value).toBe(false);
    expect(users.value).toEqual([user]);
  });

  it('shows an error notification and resets isLoading when the request fails', async () => {
    getUsersMock.mockRejectedValue({ response: { status: 500 } });

    const { getUsers, isLoading } = useUsers();
    await getUsers();

    expect(isLoading.value).toBe(false);
    expect(showNotificationMock).toHaveBeenCalledWith(
      expect.any(String),
      'error'
    );
  });
});
