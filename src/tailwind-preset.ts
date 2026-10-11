import type { Config } from 'tailwindcss';
/*
  `tailwindcss/plugin.js`, with the extension: Tailwind 3 ships no `exports`
  map, so Node's ESM resolver cannot find the extensionless specifier and the
  published `.mjs` was unloadable outside a bundler. Tailwind 4 exports both
  `./plugin` and `./plugin.js`, so the suffixed form is valid on both majors.
*/
import plugin from 'tailwindcss/plugin.js';
import {
  aquellecColors,
  aquellecMotion,
  aquellecSurfaceVariables,
  aquellecThemeExtensions,
} from './lib/design-tokens';

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
    ':root': { 'color-scheme': 'light', ...aquellecSurfaceVariables.light },
    '.dark': { 'color-scheme': 'dark', ...aquellecSurfaceVariables.dark },
  });
});

/*
  `design-tokens.ts` is frozen with `as const` so the token names are literal
  types the rest of the package can reason about. Tailwind's own `Config` type
  wants mutable arrays, so the two array-shaped families are copied here rather
  than loosened at the source: the tokens stay exactly as strict as they should
  be, and the widening happens once, at the boundary that needs it.
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
    Class strategy rather than media: the host application decides when dark
    mode applies, which is what makes a Storybook toolbar switch, a user
    preference or a per-section override possible. Adding the `dark` class on
    `<html>` (or on any ancestor) switches every component below it.
  */
  darkMode: 'class',
  theme: {
    /*
      `extend` rather than a replacement: Tailwind's own scales stay reachable.
      A consumer keeps `slate` and `violet` if they need them — the package
      simply makes its own vocabulary the one that reads best.

      `fontSize` and `fontFamily` do override their defaults, and that is the
      point of applying a design system's preset: the type is part of the
      identity, not an accessory to it. A host that wants its own face
      re-extends `fontFamily` after the preset, which is one line.
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
