import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppForm from './AppForm.vue';

describe('AppForm', () => {
  it('renders slot content inside a form element', () => {
    const wrapper = mount(AppForm, {
      slots: { default: '<div>content</div>' }
    });

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.text()).toBe('content');
  });

  it('forwards the native submit event to the parent listener', async () => {
    const wrapper = mount(AppForm);

    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toBeTruthy();
  });
});
