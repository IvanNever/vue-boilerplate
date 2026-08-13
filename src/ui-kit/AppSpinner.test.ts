import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppSpinner from './AppSpinner.vue';

describe('AppSpinner', () => {
  it('renders an indeterminate progress indicator', () => {
    const wrapper = mount(AppSpinner);
    expect(
      wrapper.find('.v-progress-circular--indeterminate').exists()
    ).toBe(true);
  });
});
