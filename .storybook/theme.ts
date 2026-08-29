import { create } from 'storybook/theming';
import { aquellecColors, aquellecThemeExtensions } from '../src/lib/design-tokens';

/*
  The Storybook interface, built from the same tokens as the components.

  Nothing here is a hand-picked hex: the chrome around a component and the
  component itself have to be the same design system, or the documentation
  quietly contradicts what it documents. When the palette moves, this moves.
*/

const { neutral, brand, ai } = aquellecColors;
const sans = aquellecThemeExtensions.fontFamily.sans.join(', ');
const mono = aquellecThemeExtensions.fontFamily.mono.join(', ');

const identity = {
  brandTitle: 'aquellec/ui',
  brandUrl: 'https://github.com/aquellec/aquellec-ui',
  brandImage: './logo.svg',
  brandTarget: '_self' as const,

  /*
    `colorPrimary` marks the active item, `colorSecondary` every interactive
    accent — selection, focus, links. Both are the brand blue rather than the
    violet: `ai` is reserved for generated content and would be a false signal
    on a sidebar row.
  */
  colorPrimary: brand[600],
  colorSecondary: brand[600],

  fontBase: sans,
  fontCode: mono,

  appBorderRadius: 8,
  inputBorderRadius: 6,
};

/** Storybook interface in light mode. */
export const aquellecTheme = create({
  base: 'light',
  ...identity,

  appBg: neutral[50],
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: neutral[200],

  textColor: neutral[900],
  textInverseColor: '#ffffff',
  textMutedColor: neutral[500],

  barTextColor: neutral[500],
  barSelectedColor: brand[600],
  barHoverColor: brand[700],
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: neutral[300],
  inputTextColor: neutral[900],
});

/**
 * Storybook interface in dark mode.
 *
 * Applied to the documentation pages through the `theme` prop of
 * `DocsContainer`, so prop tables and page chrome follow the toolbar switch
 * instead of framing dark previews in a light page.
 */
export const aquellecDarkTheme = create({
  base: 'dark',
  ...identity,

  colorSecondary: brand[400],

  appBg: neutral[950],
  appContentBg: neutral[900],
  appPreviewBg: neutral[950],
  appBorderColor: neutral[700],

  textColor: neutral[100],
  textInverseColor: neutral[950],
  textMutedColor: neutral[400],

  barTextColor: neutral[400],
  barSelectedColor: brand[300],
  barHoverColor: brand[200],
  barBg: neutral[900],

  inputBg: neutral[900],
  inputBorder: neutral[700],
  inputTextColor: neutral[100],
});

/** Exposed for the docs pages that render swatches of the interface itself. */
export const storybookChrome = { neutral, brand, ai } as const;
