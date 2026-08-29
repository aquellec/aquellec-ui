import '../src/index.css';
import { useCallback, useEffect, useState } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { LocalizedDocsPage } from './docs-page';
import { aquellecDarkTheme, aquellecTheme } from './theme';
import {
  DEFAULT_THEME,
  THEMES,
  applyTheme,
  isTheme,
  themeLabels,
  type Theme,
} from './theme-mode';
import {
  DEFAULT_LOCALE,
  I18nContext,
  LOCALES,
  getDictionary,
  isLocale,
  localeLabels,
  type Locale,
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
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

const envLocale = (() => {
  const value = env?.STORYBOOK_LOCALE;
  return isLocale(value) ? value : DEFAULT_LOCALE;
})();

const envTheme = (() => {
  const value = env?.STORYBOOK_THEME;
  return isTheme(value) ? value : DEFAULT_THEME;
})();

/**
 * Applies the light / dark mode chosen in the toolbar to every story.
 *
 * The class is set on `<html>` rather than on a wrapper, because the Modal and
 * the toasts render through a portal attached to `document.body` and would
 * otherwise stay light while the rest of the page turns dark.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = isTheme(context.globals.theme) ? context.globals.theme : DEFAULT_THEME;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <Story />;
};

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

/**
 * Reads one global from a docs context and keeps it in sync.
 *
 * MDX pages render outside the story pipeline, so decorators never run on them
 * and the preview hooks (`useGlobals`) throw. Globals therefore have to be read
 * from the docs context, then followed through the preview channel so a toolbar
 * switch updates the page without a reload. Locale and theme share this reader.
 */
function useDocsGlobal<T>(
  context: DocsContainerProps['context'],
  key: string,
  isValid: (value: unknown) => value is T,
  fallback: T
): T {
  const read = useCallback((): T => {
    const store = (context as unknown as { store?: { userGlobals?: { globals?: Record<string, unknown> } } })
      ?.store;
    const value = store?.userGlobals?.globals?.[key];
    return isValid(value) ? value : fallback;
  }, [context, key, isValid, fallback]);

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    setValue(read());

    const channel = (context as unknown as { channel?: {
      on: (event: string, handler: (payload: { globals?: Record<string, unknown> }) => void) => void;
      off: (event: string, handler: (payload: { globals?: Record<string, unknown> }) => void) => void;
    } })?.channel;
    if (!channel) return;

    const handleGlobalsUpdated = ({ globals }: { globals?: Record<string, unknown> }) => {
      const next = globals?.[key];
      if (isValid(next)) setValue(next);
    };

    channel.on(GLOBALS_UPDATED, handleGlobalsUpdated);
    return () => channel.off(GLOBALS_UPDATED, handleGlobalsUpdated);
  }, [context, key, isValid, read]);

  return value;
}

/**
 * Gives MDX documentation pages the same dictionary, `lang` and theme as the
 * stories.
 *
 * `DocsContainer` takes the Storybook theme as a prop, so the page chrome —
 * prop tables, headings, backgrounds — switches with the toolbar instead of
 * staying light around dark component previews.
 */
function DocsShell({ children, ...rest }: DocsContainerProps) {
  const locale = useDocsGlobal<Locale>(rest.context, 'locale', isLocale, DEFAULT_LOCALE);
  const theme = useDocsGlobal<Theme>(rest.context, 'theme', isTheme, DEFAULT_THEME);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <I18nContext.Provider value={getDictionary(locale)}>
      <DocsContainer {...rest} theme={theme === 'dark' ? aquellecDarkTheme : aquellecTheme}>
        <div lang={locale}>{children}</div>
      </DocsContainer>
    </I18nContext.Provider>
  );
}

const preview: Preview = {
  decorators: [withI18n, withTheme],
  globalTypes: {
    theme: {
      description: 'Light or dark rendering of the components',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        dynamicTitle: true,
        items: THEMES.map((theme) => ({
          value: theme,
          title: themeLabels[theme].title,
          icon: themeLabels[theme].icon,
        })),
      },
    },
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
      container: DocsShell,
      page: LocalizedDocsPage,
    },
    options: {
      storySort: {
        /*
          Foundations first — a reader needs the palette and the principles
          before the parts. Templates last: they are the parts assembled, and
          only make sense once the parts are known. Inside a family, Overview
          leads.
        */
        order: [
          'Foundations',
          ['Introduction', 'Tokens'],
          'Actions',
          ['Overview'],
          'Forms',
          ['Overview'],
          'Feedback',
          ['Overview'],
          'Data Display',
          ['Overview'],
          'Templates',
          ['Overview'],
          '*',
        ],
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
    /*
      `STORYBOOK_THEME=dark pnpm test:storybook` replays the whole suite in dark
      mode. The a11y addon is blocking, so contrast is checked against the dark
      palette too rather than assumed.
    */
    theme: envTheme,
  },
};

export default preview;
