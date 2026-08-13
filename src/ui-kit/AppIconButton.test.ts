import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppIconButton from './AppIconButton.vue';

describe('AppIconButton', () => {
  it('renders the requested icon and forwards click events', async () => {
    const wrapper = mount(AppIconButton, {
      props: { icon: 'mdi-account-outline' }
    });

    expect(wrapper.html()).toContain('mdi-account-outline');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
