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
 * Fournit le dictionnaire aux stories et propage la langue au DOM.
 *
 * `lang` est posé sur le conteneur de la story *et* sur `<html>` : le premier
 * porte la langue du contenu rendu, le second est ce que lisent les lecteurs
 * d'écran pour choisir leur voix, et axe pour la règle `html-has-lang`.
 */
/*
  Le preview tourne dans le navigateur : `process.env` n'y existe pas, Vite
  expose les variables préfixées `STORYBOOK_` sur `import.meta.env`.
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
      description: 'Langue des exemples de stories',
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
      `STORYBOOK_LOCALE` permet de rejouer toute la suite dans une autre langue
      (`STORYBOOK_LOCALE=fr pnpm test:storybook`). Les `play` reconstruisent
      leurs attentes depuis le dictionnaire : si une chaîne est oubliée dans une
      traduction, le test échoue au lieu de passer en silence.
    */
    locale: envLocale,
  },
};

export default preview;
