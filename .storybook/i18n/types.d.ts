import type { en } from './en';
/** Locales offered in the Storybook toolbar. */
export declare const LOCALES: readonly ['en', 'fr'];
export type Locale = (typeof LOCALES)[number];
/**
 * Shape of the dictionary, derived from English which is the reference.
 * Every translation must match it exactly.
 */
export type Dictionary = typeof en;
export declare const DEFAULT_LOCALE: Locale;
//# sourceMappingURL=types.d.ts.map