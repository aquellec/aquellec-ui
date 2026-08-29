import { create } from 'storybook/theming';

/** Storybook interface in light mode. */
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

/**
 * Storybook interface in dark mode.
 *
 * Applied to the documentation pages through the `theme` prop of
 * `DocsContainer`, so the prop tables, headings and page background follow the
 * toolbar switch instead of staying light around dark component previews.
 */
export const aquellecDarkTheme = create({
  base: 'dark',

  brandTitle: 'aquellec-ui',
  brandUrl: 'https://github.com/aquellec/aquellec-ui',
  brandImage: './logo.svg',
  brandTarget: '_self',

  colorPrimary: '#0066ff',
  colorSecondary: '#8b5cf6',

  appBg: '#020617',
  appContentBg: '#0f172a',
  appBorderColor: '#334155',
  appBorderRadius: 8,

  fontBase: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  textColor: '#f8fafc',
  textInverseColor: '#0f172a',
  textMutedColor: '#94a3b8',

  barTextColor: '#94a3b8',
  barSelectedColor: '#3690ff',
  barHoverColor: '#7cb8ff',
  barBg: '#0f172a',

  inputBg: '#0f172a',
  inputBorder: '#475569',
  inputTextColor: '#f8fafc',
  inputBorderRadius: 6,
});
