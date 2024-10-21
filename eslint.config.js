// @ts-check

import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(...tseslint.configs.recommended, importPlugin.flatConfigs.typescript, {
  files: ['**/*.{js,ts}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
