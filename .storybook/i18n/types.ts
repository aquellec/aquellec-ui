import type { en } from './en';

/** Langues proposées dans la barre d'outils Storybook. */
export const LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Forme du dictionnaire, dérivée de l'anglais qui fait référence.
 * Toute traduction doit s'y conformer exactement.
 */
export type Dictionary = typeof en;

export const DEFAULT_LOCALE: Locale = 'en';
