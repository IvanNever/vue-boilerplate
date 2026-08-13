import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default withVueTs(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/*.tsbuildinfo'
    ]
  },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  skipFormatting
)
