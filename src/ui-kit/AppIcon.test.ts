import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppIcon from './AppIcon.vue';

describe('AppIcon', () => {
  it('defaults to the rhombus icon', () => {
    const wrapper = mount(AppIcon);
    expect(wrapper.classes()).toContain('mdi-rhombus-outline');
  });

  it('renders the provided icon', () => {
    const wrapper = mount(AppIcon, { props: { icon: 'mdi-cart-variant' } });
    expect(wrapper.classes()).toContain('mdi-cart-variant');
  });
});
