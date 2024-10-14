import baseConfig, { restrictEnvAccess } from '@discord-bot/eslint-config';
import nextjsConfig from '@discord-bot/eslint-config/nextjs';
import reactConfig from '@discord-bot/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**', './postcss.config.js'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
