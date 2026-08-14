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

const aquellecPreset = {
  theme: {
    extend: {
      colors: aquellecColors,
      borderRadius: aquellecThemeExtensions.borderRadius,
      boxShadow: aquellecThemeExtensions.boxShadow,
    },
  },
  plugins: [reducedMotion],
} satisfies Partial<Config>;

export default aquellecPreset;
export { aquellecColors, aquellecThemeExtensions };
export type { AquellecColors } from './lib/design-tokens';
