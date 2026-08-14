import { createContext, useContext } from 'react';
import { en } from './en';
import { fr } from './fr';
import { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale } from './types';

export { LOCALES, DEFAULT_LOCALE };
export type { Dictionary, Locale };

export const dictionaries: Record<Locale, Dictionary> = { en, fr };

/** Storybook toolbar labels. */
export const localeLabels: Record<Locale, { title: string; flag: string }> = {
  en: { title: 'English', flag: '🇬🇧' },
  fr: { title: 'French', flag: '🇫🇷' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Dictionary matching a `globals.locale` value.
 * Usable outside rendering — most notably in `play` functions, which must expect
 * the very strings that are displayed.
 */
export function getDictionary(locale: unknown): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries[DEFAULT_LOCALE];
}

export const I18nContext = createContext<Dictionary>(en);

/** Active dictionary. Call it from a story `render`. */
export function useI18n(): Dictionary {
  return useContext(I18nContext);
}
