import type { Config } from 'tailwindcss';
import aquellecPreset from './src/tailwind-preset';

const config: Config = {
  presets: [aquellecPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};

export default config;
