import baseConfig from './base.mjs';
import eslintPluginAstro from 'eslint-plugin-astro';
import pluginPromise from 'eslint-plugin-promise';

export default [...baseConfig, ...eslintPluginAstro.configs['flat/all'], pluginPromise.configs['flat/recommended']];
