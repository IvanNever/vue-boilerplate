import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppButton from './AppButton.vue';

describe('AppButton', () => {
  it('renders slot content and forwards click events', async () => {
    const wrapper = mount(AppButton, { slots: { default: 'Click me' } });

    expect(wrapper.text()).toBe('Click me');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('shows a loading state', () => {
    const wrapper = mount(AppButton, { props: { loading: true } });
    expect(wrapper.find('.v-btn--loading').exists()).toBe(true);
  });
});
