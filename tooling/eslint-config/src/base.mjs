import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      // Tooling configurations
      '**/*.d.ts',

      // Dependency directories
      '**/node_modules/**',
      '.pnpm',

      // Build and distribution directories
      '**/public**/',
      '**/dist**/',
      '**/.vercel**/',

      // Development tooling and configuration
      '.husky',
      '.vscode',
      '.astro',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
