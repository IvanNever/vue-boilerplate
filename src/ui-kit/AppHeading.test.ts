import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeading from './AppHeading.vue';

describe('AppHeading', () => {
  it('renders the requested heading tag with slot content', () => {
    const wrapper = mount(AppHeading, {
      props: { type: 'h2' },
      slots: { default: 'Title' }
    });

    expect(wrapper.element.tagName).toBe('H2');
    expect(wrapper.text()).toBe('Title');
  });

  it('computes a one-level-smaller heading class for medium+ screens', () => {
    expect(mount(AppHeading, { props: { type: 'h1' } }).classes()).toContain(
      'text-md-h1'
    );
    expect(mount(AppHeading, { props: { type: 'h2' } }).classes()).toContain(
      'text-md-h1'
    );
    expect(mount(AppHeading, { props: { type: 'h3' } }).classes()).toContain(
      'text-md-h2'
    );
  });
});
