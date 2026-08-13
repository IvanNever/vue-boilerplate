import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AccountView from './AccountView.vue';
import AppSpinner from '@/ui-kit/AppSpinner.vue';
import { useAuth } from '@/auth/composables/useAuth';
import { userFixture } from '@/infrastructure/test-utils/fixtures/userFixture';

vi.mock('@/auth/infrastructure/context', () => ({
  authContext: { get: () => ({}) }
}));

describe('AccountView', () => {
  beforeEach(() => {
    useAuth().currentUser.value = null;
  });

  it('shows a spinner while the current user has not loaded', () => {
    const wrapper = mount(AccountView);

    expect(wrapper.findComponent(AppSpinner).exists()).toBe(true);
  });

  it('renders the account forms once the current user is loaded', () => {
    useAuth().currentUser.value = userFixture();

    const wrapper = mount(AccountView);

    expect(wrapper.findComponent(AppSpinner).exists()).toBe(false);
    expect(wrapper.text()).toContain('Update your account data');
    expect(wrapper.text()).toContain('Update your password');
  });
});
