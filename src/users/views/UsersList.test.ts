import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import UsersList from './UsersList.vue';
import AppSpinner from '@/ui-kit/AppSpinner.vue';
import { userFixture } from '@/infrastructure/test-utils/fixtures/userFixture';
import { useUsers } from '@/users/composables/useUsers';

const { getUsersMock, pushMock } = vi.hoisted(() => ({
  getUsersMock: vi.fn(),
  pushMock: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}));

vi.mock('@/users/infrastructure/context', () => ({
  usersContext: {
    get: () => ({ getUsers: getUsersMock })
  }
}));

describe('UsersList', () => {
  beforeEach(() => {
    getUsersMock.mockReset();
    pushMock.mockReset();
    useUsers().users.value = [];
  });

  it('shows a spinner while loading, then the fetched users', async () => {
    let resolveGetUsers!: (users: ReturnType<typeof userFixture>[]) => void;
    getUsersMock.mockReturnValue(
      new Promise((resolve) => {
        resolveGetUsers = resolve;
      })
    );

    const wrapper = mount(UsersList);
    await nextTick();
    expect(wrapper.findComponent(AppSpinner).exists()).toBe(true);

    resolveGetUsers([
      userFixture({ id: 1, email: 'a@example.com' }),
      userFixture({ id: 2, email: 'b@example.com' })
    ]);
    await flushPromises();

    expect(wrapper.findComponent(AppSpinner).exists()).toBe(false);
    expect(wrapper.text()).toContain('a@example.com');
    expect(wrapper.text()).toContain('b@example.com');
  });

  it('shows an empty state when there are no users', async () => {
    getUsersMock.mockResolvedValue([]);

    const wrapper = mount(UsersList);
    await flushPromises();

    expect(wrapper.text()).toContain('No users');
  });

  it('navigates to the create-user route', async () => {
    getUsersMock.mockResolvedValue([]);
    const wrapper = mount(UsersList);
    await flushPromises();

    await wrapper.find('button').trigger('click');

    expect(pushMock).toHaveBeenCalledWith({ name: 'user-create' });
  });
});
