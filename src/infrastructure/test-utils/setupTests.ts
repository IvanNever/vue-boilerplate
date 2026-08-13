import { vi } from 'vitest';
import ResizeObserver from 'resize-observer-polyfill';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

vi.stubGlobal('ResizeObserver', ResizeObserver);

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
});

config.global.plugins = [vuetify];
