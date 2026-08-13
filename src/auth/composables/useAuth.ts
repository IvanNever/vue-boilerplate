import { ref } from 'vue';
import { authRepo } from '@/auth/api/authRepoImpl';
import { apiErrors } from '@/infrastructure/utils/apiErrors';
import { useNotification } from '@/ui-kit/appNotification/useNotification';

import type { User } from '@/users/domain/User';
import type { Token } from '@/auth/domain/Token';

const currentUser = ref<User | null>(null);
const token = ref<Token | null>(null);
const isLoading = ref(false);

export function useAuth() {
  const { showNotification } = useNotification();

  async function updateCurrentUserPassword(password: string): Promise<void> {
    try {
      isLoading.value = true;
      await authRepo.updateCurrentUserPassword(password);
      showNotification('Password updated successfully', 'success');
    } catch (error) {
      showNotification(apiErrors(error), 'error');
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentUser,
    token,
    isLoading,
    updateCurrentUserPassword
  };
}
