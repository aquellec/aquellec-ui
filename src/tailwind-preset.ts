import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { aquellecColors, aquellecThemeExtensions } from './lib/design-tokens';

/**
 * Neutralise animations et transitions quand l'utilisateur demande moins de
 * mouvement (WCAG 2.3.3). Porté par le preset plutôt que par `src/index.css`,
 * qui n'est pas publié : les applications hôtes en héritent ainsi sans import
 * supplémentaire, dès lors qu'elles appliquent le preset.
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
