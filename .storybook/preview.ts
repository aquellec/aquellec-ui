import '../src/index.css';
import type { Preview } from '@storybook/react-vite';
import { aquellecTheme } from './theme';

const aquellecViewports = {
  mobile: {
    name: 'Mobile',
    styles: { width: '375px', height: '812px' },
    type: 'mobile' as const,
  },
  tablet: {
    name: 'Tablet',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet' as const,
  },
  desktop: {
    name: 'Desktop',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop' as const,
  },
  wide: {
    name: 'Wide',
    styles: { width: '1536px', height: '900px' },
    type: 'desktop' as const,
  },
};

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: aquellecViewports,
    },
    a11y: {
      test: 'error',
    },
    interactions: {
      disable: false,
    },
    docs: {
      theme: aquellecTheme,
      toc: true,
    },
    options: {
      storySort: {
        order: ['Docs', 'Templates', 'Components', '*'],
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};

export default preview;
