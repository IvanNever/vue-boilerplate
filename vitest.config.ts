import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/infrastructure/test-utils/setupTests.ts'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      passWithNoTests: true,
      root: fileURLToPath(new URL('./', import.meta.url)),
      server: {
        deps: {
          inline: ['vuetify']
        }
      }
    }
  })
);
