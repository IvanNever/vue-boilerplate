import { describe, expect, it, vi, beforeEach } from 'vitest';
import { h } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { VApp } from 'vuetify/components';
import AppHeader from './AppHeader.vue';
import AppIconButton from '@/ui-kit/AppIconButton.vue';
import { userFixture } from '@/infrastructure/test-utils/fixtures/userFixture';

function mountInApp() {
  return mount(VApp, { slots: { default: () => h(AppHeader) } });
}

const { getCurrentUserMock, pushMock } = vi.hoisted(() => ({
  getCurrentUserMock: vi.fn(),
  pushMock: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}));

vi.mock('@/auth/api/authRepoImpl', () => ({
  authRepo: { getCurrentUser: getCurrentUserMock }
}));

describe('AppHeader', () => {
  beforeEach(() => {
    getCurrentUserMock.mockReset();
    pushMock.mockReset();
  });

  it('loads and displays the current user on mount', async () => {
    getCurrentUserMock.mockResolvedValue(userFixture({ username: 'jdoe' }));

    const wrapper = mountInApp();
    await flushPromises();

    expect(wrapper.text()).toContain('jdoe');
  });

  it('navigates to the account page', async () => {
    getCurrentUserMock.mockResolvedValue(userFixture());
    const wrapper = mountInApp();
    await flushPromises();

    const [accountButton] = wrapper.findAllComponents(AppIconButton);
    await accountButton.trigger('click');

    expect(pushMock).toHaveBeenCalledWith({ name: 'account' });
  });
});
