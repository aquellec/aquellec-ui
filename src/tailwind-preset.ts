import type { Config } from 'tailwindcss';
/*
  `tailwindcss/plugin.js` with its extension: Tailwind 3 has no `exports` map,
  so Node's ESM resolver cannot resolve the extensionless specifier. Tailwind 4
  exports both forms.
*/
import plugin from 'tailwindcss/plugin.js';
import {
  aquellecColors,
  aquellecMotion,
  aquellecSurfaceVariables,
  aquellecThemeExtensions,
} from './lib/design-tokens';

/**
 * Disables animations and transitions under `prefers-reduced-motion` (WCAG
 * 2.3.3). Shipped in the preset because `src/index.css` is not published.
 */
const reducedMotion = plugin(({ addBase }) => {
  addBase({
    '@media (prefers-reduced-motion: reduce)': {
      '*, ::before, ::after': {
        'animation-duration': '0.01ms !important',
        'animation-iteration-count': '1 !important',
        'transition-duration': '0.01ms !important',
        'scroll-behavior': 'auto !important',
      },
    },
  });
});

/**
 * Sets `color-scheme` so native UI (scrollbars, form controls) follows the
 * theme. Pinned to the `dark` class rather than `prefers-color-scheme`,
 * matching the `class` dark mode strategy.
 */
const colorScheme = plugin(({ addBase }) => {
  addBase({
    ':root': { 'color-scheme': 'light', ...aquellecSurfaceVariables.light },
    '.dark': { 'color-scheme': 'dark', ...aquellecSurfaceVariables.dark },
  });
});

/*
  The tokens are `as const`; Tailwind's `Config` type expects mutable arrays, so
  the array-shaped families are copied here instead of loosening the source
  types.
*/
const fontFamily: Record<string, string[]> = Object.fromEntries(
  Object.entries(aquellecThemeExtensions.fontFamily).map(([name, stack]) => [name, [...stack]])
);

const fontSize: Record<string, [string, { lineHeight: string; letterSpacing: string }]> =
  Object.fromEntries(
    Object.entries(aquellecThemeExtensions.fontSize).map(([name, [size, metrics]]) => [
      name,
      [size, { ...metrics }],
    ])
  );

const aquellecPreset = {
  /*
    `class` strategy: dark mode applies below any ancestor with the `dark`
    class, so the host application controls it.
  */
  darkMode: 'class',
  theme: {
    /*
      `extend` keeps Tailwind's default scales available. `fontSize` and
      `fontFamily` keys replace the defaults of the same name; a host can re-
      extend `fontFamily` after the preset.
    */
    extend: {
      colors: aquellecColors,
      fontFamily,
      fontSize,
      letterSpacing: aquellecThemeExtensions.letterSpacing,
      borderRadius: aquellecThemeExtensions.borderRadius,
      boxShadow: aquellecThemeExtensions.boxShadow,
      maxWidth: aquellecThemeExtensions.maxWidth,
      transitionTimingFunction: aquellecMotion.easing,
    },
  },
  plugins: [reducedMotion, colorScheme],
} satisfies Partial<Config>;

export default aquellecPreset;
export { aquellecColors, aquellecMotion, aquellecSurfaceVariables, aquellecThemeExtensions };
export type { AquellecColors, AquellecMotion } from './lib/design-tokens';
