import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppPageHeading from './AppPageHeading.vue';

describe('AppPageHeading', () => {
  it('renders the title, breadcrumbs and slot content', () => {
    const wrapper = mount(AppPageHeading, {
      props: {
        title: 'Users',
        breadcrumbs: [{ title: 'Users', disabled: true, href: 'users' }]
      },
      slots: { default: '<button>Add</button>' }
    });

    expect(wrapper.text()).toContain('Users');
    expect(wrapper.text()).toContain('Add');
  });
});
