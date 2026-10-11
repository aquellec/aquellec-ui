import { create } from 'storybook/theming';
import {
  aquellecColors,
  aquellecSurfaceVariables,
  aquellecThemeExtensions,
} from '../src/lib/design-tokens';

/*
  The Storybook interface, built from the same tokens as the components.

  The chrome used to carry its own copy of the palette as ten hex literals, so
  the manager and the canvas were two design systems that happened to look
  alike. Every value below is read from `src/lib/design-tokens.ts` instead:
  change the ink ramp and the sidebar changes with it, or the change is a bug.

  `create()` takes flat strings, so the font stacks are joined here — the one
  transformation this file performs.
*/

const { ink, brand, ai } = aquellecColors;

/* The raised surface, read from the token that the components render against. */
const paper = aquellecSurfaceVariables.light['--aq-surface-raised'];
const { fontFamily } = aquellecThemeExtensions;

const sansStack = fontFamily.sans.join(', ');
const monoStack = fontFamily.mono.join(', ');

/** Shared identity: what does not change between light and dark. */
const identity = {
  brandTitle: 'aquellec/ui',
  brandUrl: 'https://github.com/aquellec/aquellec-ui',
  brandImage: './logo.svg',
  brandTarget: '_self' as const,

  colorPrimary: brand[600],
  colorSecondary: ai[600],

  fontBase: sansStack,
  fontCode: monoStack,

  /*
    12px and 8px, matching the `2xl` and `xl` radius tokens. Storybook applies
    these to panels and to the search field; the components apply the same
    ladder to cards and controls, so the corner logic reads as one decision
    rather than two.
  */
  appBorderRadius: 12,
  inputBorderRadius: 8,
};

/** Storybook interface in light mode: full ink on white. */
export const aquellecTheme = create({
  base: 'light',
  ...identity,

  appBg: ink[50],
  appContentBg: paper,
  appPreviewBg: paper,
  appBorderColor: ink[200],

  textColor: ink[900],
  textInverseColor: ink[50],
  textMutedColor: ink[500],

  barTextColor: ink[500],
  barSelectedColor: brand[700],
  barHoverColor: brand[600],
  barBg: paper,

  inputBg: paper,
  inputBorder: ink[400],
  inputTextColor: ink[900],
});

/**
 * Storybook interface in dark mode.
 *
 * Applied to the documentation pages through the `theme` prop of
 * `DocsContainer`, so the prop tables, headings and page background follow the
 * toolbar switch instead of staying light around dark component previews.
 *
 * The accents step up a shade rather than keeping their light values: `brand`
 * at `-600` is the correct action colour on paper and disappears against a near
 * black sidebar, which is the same inversion every component makes.
 */
export const aquellecDarkTheme = create({
  base: 'dark',
  ...identity,

  colorPrimary: brand[400],
  colorSecondary: ai[400],

  appBg: ink[950],
  appContentBg: ink[900],
  appPreviewBg: ink[900],
  appBorderColor: ink[700],

  textColor: ink[50],
  textInverseColor: ink[950],
  textMutedColor: ink[300],

  barTextColor: ink[300],
  barSelectedColor: brand[300],
  barHoverColor: brand[200],
  barBg: ink[900],

  inputBg: ink[900],
  inputBorder: ink[500],
  inputTextColor: ink[50],
});
