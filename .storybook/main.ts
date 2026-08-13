import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  docs: {
    defaultName: 'Documentation',
  },
  async viteFinal(config) {
    return {
      ...config,
      build: {
        ...config.build,
        chunkSizeWarningLimit: 2000,
      },
    };
  },
};

export default config;
