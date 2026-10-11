import { addons } from 'storybook/manager-api';
import { aquellecTheme } from './theme';

/*
  The manager only ever renders one theme — it has no access to the preview's
  toolbar global — so it is pinned to the light interface, which is the one the
  documentation is authored against. The canvas and the docs pages both follow
  the switch; see `DocsShell` in `preview.tsx`.
*/
addons.setConfig({
  theme: aquellecTheme,
  sidebar: {
    showRoots: true,
  },
});
