import type { en } from './en';

/** Locales offered in the Storybook toolbar. */
export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Shape of the dictionary, derived from English which is the reference.
 * Every translation must match it exactly.
 */
export type Dictionary = typeof en;

export const DEFAULT_LOCALE: Locale = 'en';
