import type { StorybookConfig } from '@storybook/angular-vite';
import { resolve } from 'node:path';

const configDirectory = import.meta.dirname;

const config: StorybookConfig = {
  stories: ['../../../projects/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      '@argfit-ui/core': resolve(configDirectory, '../../../projects/argfit-ui-core/src/public-api.ts'),
      '@argfit-ui/desktop': resolve(configDirectory, '../../../projects/argfit-ui-desktop/src/public-api.ts'),
      '@argfit-ui/mobile': resolve(configDirectory, '../../../projects/argfit-ui-mobile/src/public-api.ts'),
      '@argfit-ui/adaptive': resolve(configDirectory, '../../../projects/argfit-ui-adaptive/src/public-api.ts'),
      '@argfit-ui/primitives': resolve(configDirectory, '../../../projects/argfit-ui-primitives/src/public-api.ts'),
    };
    return viteConfig;
  },
};

export default config;
