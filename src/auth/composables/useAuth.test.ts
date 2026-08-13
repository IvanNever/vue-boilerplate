import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useAuth } from './useAuth';

const { updatePasswordMock, showNotificationMock } = vi.hoisted(() => ({
  updatePasswordMock: vi.fn(),
  showNotificationMock: vi.fn()
}));

vi.mock('@/auth/infrastructure/context', () => ({
  authContext: {
    get: () => ({ updateCurrentUserPassword: updatePasswordMock })
  }
}));

vi.mock('@/ui-kit/appNotification/useNotification', () => ({
  useNotification: () => ({ showNotification: showNotificationMock })
}));

describe('useAuth', () => {
  beforeEach(() => {
    updatePasswordMock.mockReset();
    showNotificationMock.mockReset();
  });

  describe('updateCurrentUserPassword', () => {
    it('calls the repo and shows a success notification', async () => {
      updatePasswordMock.mockResolvedValue(undefined);

      const { updateCurrentUserPassword, isLoading } = useAuth();
      const pending = updateCurrentUserPassword('new-pass');

      expect(isLoading.value).toBe(true);
      await pending;

      expect(isLoading.value).toBe(false);
      expect(updatePasswordMock).toHaveBeenCalledWith('new-pass');
      expect(showNotificationMock).toHaveBeenCalledWith(
        'Password updated successfully',
        'success'
      );
    });

    it('shows an error notification and resets isLoading when the request fails', async () => {
      updatePasswordMock.mockRejectedValue({ response: { status: 500 } });

      const { updateCurrentUserPassword, isLoading } = useAuth();
      await updateCurrentUserPassword('new-pass');

      expect(isLoading.value).toBe(false);
      expect(showNotificationMock).toHaveBeenCalledWith(
        expect.any(String),
        'error'
      );
    });
  });
});
