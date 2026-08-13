import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import LoginView from './LoginView.vue';
import AppInput from '@/ui-kit/AppInput.vue';
import AppButton from '@/ui-kit/AppButton.vue';

const { signInMock, pushMock, showNotificationMock } = vi.hoisted(() => ({
  signInMock: vi.fn(),
  pushMock: vi.fn(),
  showNotificationMock: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}));

vi.mock('@/auth/infrastructure/context', () => ({
  authContext: {
    get: () => ({ signIn: signInMock })
  }
}));

vi.mock('@/ui-kit/appNotification/useNotification', () => ({
  useNotification: () => ({ showNotification: showNotificationMock })
}));

describe('LoginView', () => {
  beforeEach(() => {
    signInMock.mockReset();
    pushMock.mockReset();
    showNotificationMock.mockReset();
  });

  it('renders the login form', () => {
    const wrapper = mount(LoginView);

    expect(wrapper.findAllComponents(AppInput)).toHaveLength(2);
    expect(wrapper.findComponent(AppButton).exists()).toBe(true);
  });

  it('shows validation errors and blocks submit when fields are empty', async () => {
    const wrapper = mount(LoginView);

    await wrapper.find('form').trigger('submit');

    expect(signInMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('This field is required');
  });

  it('signs in and navigates home on valid submit', async () => {
    signInMock.mockResolvedValue({
      token: 'jwt-token',
      user: { id: 1, username: 'user' }
    });
    const wrapper = mount(LoginView);

    const [emailInput, passwordInput] = wrapper.findAllComponents(AppInput);
    await emailInput.find('input').setValue('user@example.com');
    await passwordInput.find('input').setValue('secret');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(signInMock).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret'
    });
    expect(pushMock).toHaveBeenCalledWith({ name: 'home' });
  });

  it('shows a notification when sign-in fails', async () => {
    signInMock.mockRejectedValue({ response: { status: 401 } });
    const wrapper = mount(LoginView);

    const [emailInput, passwordInput] = wrapper.findAllComponents(AppInput);
    await emailInput.find('input').setValue('user@example.com');
    await passwordInput.find('input').setValue('wrong-password');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(showNotificationMock).toHaveBeenCalledWith(
      expect.any(String),
      'error'
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
});
