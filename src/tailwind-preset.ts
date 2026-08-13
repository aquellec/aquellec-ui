import type { Config } from 'tailwindcss';
import { aquellecColors, aquellecThemeExtensions } from './lib/design-tokens';

const aquellecPreset = {
  theme: {
    extend: {
      colors: aquellecColors,
      borderRadius: aquellecThemeExtensions.borderRadius,
      boxShadow: aquellecThemeExtensions.boxShadow,
    },
  },
} satisfies Partial<Config>;

export default aquellecPreset;
export { aquellecColors, aquellecThemeExtensions };
export type { AquellecColors } from './lib/design-tokens';
