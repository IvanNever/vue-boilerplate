import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AppNotification from './AppNotification.vue';
import { useNotification } from './useNotification';

describe('AppNotification', () => {
  it('shows the current notification message when open', async () => {
    const { showNotification } = useNotification();
    showNotification('Something happened', 'success');

    const wrapper = mount(AppNotification, { attachTo: document.body });
    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain('Something happened');
  });
});
