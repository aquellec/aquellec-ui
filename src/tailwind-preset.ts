import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
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
      borderRadius: aquellecThemeExtensions.borderRadius,
      boxShadow: aquellecThemeExtensions.boxShadow,
    },
  },
  plugins: [reducedMotion, colorScheme],
} satisfies Partial<Config>;

export default aquellecPreset;
export { aquellecColors, aquellecThemeExtensions };
export type { AquellecColors } from './lib/design-tokens';
