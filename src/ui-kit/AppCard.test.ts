import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppCard from './AppCard.vue';

describe('AppCard', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppCard, { slots: { default: 'Card content' } });
    expect(wrapper.text()).toBe('Card content');
  });
});
