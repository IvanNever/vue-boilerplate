import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppLogo from './AppLogo.vue';

describe('AppLogo', () => {
  it('renders the large login-page variant', () => {
    const wrapper = mount(AppLogo, { props: { isLoginPage: true } });

    expect(wrapper.find('.login').exists()).toBe(true);
    expect(wrapper.text()).toContain('VueMart');
  });

  it('renders as a home link by default', () => {
    const wrapper = mount(AppLogo, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
    });

    expect(wrapper.text()).toContain('VueMart');
  });
});
