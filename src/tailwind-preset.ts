import type { Config } from 'tailwindcss';
/*
  `tailwindcss/plugin.js`, with the extension: Tailwind 3 ships no `exports`
  map, so Node's ESM resolver cannot find the extensionless specifier and the
  published `.mjs` was unloadable outside a bundler. Tailwind 4 exports both
  `./plugin` and `./plugin.js`, so the suffixed form is valid on both majors.
*/
import plugin from 'tailwindcss/plugin.js';
import { aquellecColors, aquellecThemeExtensions } from './lib/design-tokens';

/**
 * Neutralises animations and transitions when the user asks for reduced motion
 * (WCAG 2.3.3). Carried by the preset rather than by `src/index.css`, which is
 * not published: host applications inherit it with no extra import as soon as
 * they apply the preset.
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
 * Declares the active color scheme to the browser so its own UI follows the
 * theme: scrollbars, form control chrome, spell-check underlines and the
 * default canvas behind the page.
 *
 * The scheme is pinned rather than left to `prefers-color-scheme`, because the
 * `class` strategy makes the application the source of truth. A host that wants
 * to follow the OS toggles the `dark` class itself.
 */
const colorScheme = plugin(({ addBase }) => {
  addBase({
    ':root': { 'color-scheme': 'light' },
    '.dark': { 'color-scheme': 'dark' },
  });
});

/**
 * Surface custom properties, for the places a Tailwind class cannot reach.
 *
 * An inline `style` carries no `dark:` variant, and a class assembled at
 * runtime is invisible to the content scanner — so a component that needs the
 * current surface colour inside a gradient has no way to ask for it. These two
 * properties answer that, and flip with the theme like everything else.
 */
const surfaceVariables = plugin(({ addBase }) => {
  addBase({
    ':root': {
      '--aq-surface': '#ffffff',
      '--aq-surface-ink': `rgb(13 17 23 / 0.14)`,
    },
    '.dark': {
      '--aq-surface': aquellecColors.neutral[900],
      '--aq-surface-ink': 'rgb(0 0 0 / 0.55)',
    },
  });
});

const aquellecPreset = {
  /*
    Class strategy rather than media: the host application decides when dark
    mode applies, which is what makes a Storybook toolbar switch, a user
    preference or a per-section override possible. Adding the `dark` class on
    `<html>` (or on any ancestor) switches every component below it.
  */
  darkMode: 'class',
  theme: {
    extend: {
      colors: aquellecColors,
      /*
        The tokens are frozen with `as const`, which is what lets the generator
        read their exact shape; Tailwind's config type wants mutable arrays and
        tuples. The copies below are that conversion, kept at the single
        boundary where it is needed rather than by loosening the tokens.
      */
      fontFamily: Object.fromEntries(
        Object.entries(aquellecThemeExtensions.fontFamily).map(([name, stack]) => [
          name,
          [...stack],
        ])
      ),
      fontSize: Object.fromEntries(
        Object.entries(aquellecThemeExtensions.fontSize).map(([name, [size, meta]]) => [
          name,
          [size, { ...meta }],
        ])
      ),
      borderRadius: aquellecThemeExtensions.borderRadius,
      boxShadow: aquellecThemeExtensions.boxShadow,
      transitionTimingFunction: aquellecThemeExtensions.transitionTimingFunction,
    },
  },
  plugins: [reducedMotion, colorScheme, surfaceVariables],
} satisfies Partial<Config>;

export default aquellecPreset;
export { aquellecColors, aquellecThemeExtensions };
export type { AquellecColors } from './lib/design-tokens';
