import { addons } from 'storybook/manager-api';
import { aquellecTheme } from './theme';

addons.setConfig({
  theme: aquellecTheme,
  sidebar: {
    showRoots: true,
  },
});
