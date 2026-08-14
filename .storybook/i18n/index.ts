import { createContext, useContext } from 'react';
import { en } from './en';
import { fr } from './fr';
import { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale } from './types';

export { LOCALES, DEFAULT_LOCALE };
export type { Dictionary, Locale };

export const dictionaries: Record<Locale, Dictionary> = { en, fr };

/** Libellés de la barre d'outils Storybook. */
export const localeLabels: Record<Locale, { title: string; flag: string }> = {
  en: { title: 'English', flag: '🇬🇧' },
  fr: { title: 'Français', flag: '🇫🇷' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Dictionnaire correspondant à une valeur de `globals.locale`.
 * Utilisable hors rendu — notamment dans les `play`, qui doivent attendre les
 * mêmes chaînes que celles affichées.
 */
export function getDictionary(locale: unknown): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries[DEFAULT_LOCALE];
}

export const I18nContext = createContext<Dictionary>(en);

/** Dictionnaire actif, à appeler dans le `render` d'une story. */
export function useI18n(): Dictionary {
  return useContext(I18nContext);
}
