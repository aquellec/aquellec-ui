import { create } from 'storybook/theming';

export const aquellecTheme = create({
  base: 'light',

  brandTitle: 'aquellec-ui',
  brandUrl: 'https://github.com/aquellec/aquellec-ui',
  brandImage: './logo.svg',
  brandTarget: '_self',

  colorPrimary: '#0066ff',
  colorSecondary: '#8b5cf6',

  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,

  fontBase: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  textMutedColor: '#64748b',

  barTextColor: '#64748b',
  barSelectedColor: '#0066ff',
  barHoverColor: '#0052cc',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputTextColor: '#0f172a',
  inputBorderRadius: 6,
});
