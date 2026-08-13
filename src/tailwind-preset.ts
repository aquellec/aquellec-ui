import type { Config } from 'tailwindcss';

/** Brand and AI color tokens used across @aquellec/ui components. */
const aquellecColors = {
  brand: {
    50: '#f0f7ff',
    100: '#e0effe',
    500: '#0066ff',
    600: '#0052cc',
    700: '#003d99',
  },
  ai: {
    50: '#f5f3ff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
} as const;

const aquellecPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: aquellecColors,
    },
  },
};

export default aquellecPreset;
