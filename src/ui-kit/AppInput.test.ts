import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppInput from './AppInput.vue';

describe('AppInput', () => {
  it('renders the label and reflects the model value', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: 'hello', label: 'Name' }
    });

    expect(wrapper.text()).toContain('Name');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
      'hello'
    );
  });

  it('emits update:model-value when typed into', async () => {
    const wrapper = mount(AppInput, { props: { modelValue: '' } });

    await wrapper.find('input').setValue('typed');

    expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['typed']);
  });

  it('shows validation error messages', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', errorMessages: 'This field is required' }
    });

    expect(wrapper.text()).toContain('This field is required');
  });
});
