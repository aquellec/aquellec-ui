import '../src/index.css';
import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { aquellecTheme } from './theme';
import {
  DEFAULT_LOCALE,
  I18nContext,
  LOCALES,
  getDictionary,
  isLocale,
  localeLabels,
} from './i18n';

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

/**
 * Provides the dictionary to the stories and propagates the locale to the DOM.
 *
 * `lang` is set on the story container *and* on `<html>`: the former carries the
 * language of the rendered content, the latter is what screen readers read to
 * pick a voice, and what axe checks for the `html-has-lang` rule.
 */
/*
  The preview runs in the browser, where `process.env` does not exist: Vite
  exposes `STORYBOOK_`-prefixed variables on `import.meta.env` instead.
*/
const envLocale = (() => {
  const value = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.STORYBOOK_LOCALE;
  return isLocale(value) ? value : DEFAULT_LOCALE;
})();

const withI18n: Decorator = (Story, context) => {
  const locale = isLocale(context.globals.locale) ? context.globals.locale : DEFAULT_LOCALE;
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previous;
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={dictionary}>
      <div lang={locale}>
        <Story />
      </div>
    </I18nContext.Provider>
  );
};

const preview: Preview = {
  decorators: [withI18n],
  globalTypes: {
    locale: {
      description: 'Language of the story examples',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        dynamicTitle: true,
        items: LOCALES.map((locale) => ({
          value: locale,
          title: localeLabels[locale].title,
          right: localeLabels[locale].flag,
        })),
      },
    },
  },
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
        order: ['Docs', 'Templates', 'Actions', 'Forms', 'Feedback', 'Data Display', '*'],
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
    /*
      `STORYBOOK_LOCALE` replays the whole suite in another language
      (`STORYBOOK_LOCALE=fr pnpm test:storybook`). `play` functions rebuild their
      expectations from the dictionary, so a string missing from a translation
      fails the test instead of passing silently.
    */
    locale: envLocale,
  },
};

export default preview;
