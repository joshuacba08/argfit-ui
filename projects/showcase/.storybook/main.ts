import type { StorybookConfig } from '@storybook/angular-vite';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('../../../', import.meta.url));
const fromWorkspace = (path: string): string => `${workspaceRoot.replaceAll('\\', '/')}${path}`;

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.docs.mdx',
    '../../argfit-ui-adaptive/src/**/*.docs.mdx',
    '../../argfit-ui-adaptive/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/angular-vite',
    options: {
      compodoc: false,
      tsconfig: fromWorkspace('projects/showcase/.storybook/tsconfig.json'),
    },
  },
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  async viteFinal(viteConfig) {
    viteConfig.root = workspaceRoot;
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [
      {
        find: /^@argfit-ui\/core$/,
        replacement: fromWorkspace('projects/argfit-ui-core/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/primitives$/,
        replacement: fromWorkspace('projects/argfit-ui-primitives/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/chart-runtime$/,
        replacement: fromWorkspace('projects/argfit-ui-chart-runtime/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/desktop$/,
        replacement: fromWorkspace('projects/argfit-ui-desktop/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/desktop\/chart$/,
        replacement: fromWorkspace('projects/argfit-ui-desktop/chart/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/mobile$/,
        replacement: fromWorkspace('projects/argfit-ui-mobile/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/mobile\/chart$/,
        replacement: fromWorkspace('projects/argfit-ui-mobile/chart/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/adaptive$/,
        replacement: fromWorkspace('projects/argfit-ui-adaptive/src/public-api.ts'),
      },
      {
        find: /^@argfit-ui\/adaptive\/chart$/,
        replacement: fromWorkspace('projects/argfit-ui-adaptive/chart/src/public-api.ts'),
      },
      ...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : []),
    ];
    return viteConfig;
  },
};
export default config;
