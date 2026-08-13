import { ref } from 'vue';
import { apiErrors } from '@/infrastructure/utils/apiErrors';
import { useNotification } from '@/ui-kit/appNotification/useNotification';
import { usersContext } from '@/users/infrastructure/context';

import type { User } from '../domain/User';
import type { UsersRepo } from '@/users/domain/usersRepo';

const users = ref<User[]>([]);
const isLoading = ref(false);

export function useUsers() {
  const userRepo = usersContext.get<UsersRepo>('UsersRepository');
  const { showNotification } = useNotification();

  async function getUsers(): Promise<void> {
    try {
      isLoading.value = true;
      users.value = await userRepo.getUsers();
    } catch (err) {
      showNotification(apiErrors(err), 'error');
    } finally {
      isLoading.value = false;
    }
  }

  return { users, isLoading, getUsers };
}
