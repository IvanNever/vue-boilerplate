import { ref } from 'vue';
import { apiErrors } from '@/infrastructure/utils/apiErrors';
import { useNotification } from '@/ui-kit/appNotification/useNotification';
import { usersRepo } from '@/users/api/usersRepoImpl';

import type { User } from '../domain/User';

const users = ref<User[]>([]);
const isLoading = ref(false);

export function useUsers() {
  const { showNotification } = useNotification();

  async function getUsers(): Promise<void> {
    try {
      isLoading.value = true;
      users.value = await usersRepo.getUsers();
    } catch (err) {
      showNotification(apiErrors(err), 'error');
    } finally {
      isLoading.value = false;
    }
  }

  return { users, isLoading, getUsers };
}
