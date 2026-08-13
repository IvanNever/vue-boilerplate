import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import UserDetails from './UserDetails.vue';
import { useUsers } from '../composables/useUsers';
import { userFixture } from '@/infrastructure/test-utils/fixtures/userFixture';

const { getUsersMock } = vi.hoisted(() => ({ getUsersMock: vi.fn() }));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } })
}));

vi.mock('@/users/infrastructure/context', () => ({
  usersContext: {
    get: () => ({ getUsers: getUsersMock })
  }
}));

describe('UserDetails', () => {
  beforeEach(() => {
    getUsersMock.mockReset();
    useUsers().users.value = [];
  });

  it('renders the page heading and breadcrumb for the matched user', async () => {
    getUsersMock.mockResolvedValue([userFixture({ id: 1 })]);

    const wrapper = mount(UserDetails);
    await flushPromises();

    expect(wrapper.text()).toContain('User Details Page');
    expect(wrapper.text()).toContain('User #1 Details');
  });

  it('fetches users only when the shared user list is empty', async () => {
    useUsers().users.value = [userFixture({ id: 1 })];

    mount(UserDetails);
    await flushPromises();

    expect(getUsersMock).not.toHaveBeenCalled();
  });
});
