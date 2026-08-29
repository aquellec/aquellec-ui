import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { aquellecThemeExtensions } from './design-tokens';

/*
  tailwind-merge resolves conflicts from a built-in map of Tailwind's own
  scales. It has never heard of this system's type steps, so it read `text-body`
  as a text *colour* and dropped the `text-white` that came before it — every
  primary button rendered black copy on the brand fill, at 3.14:1.

  Teaching it the custom scales is the fix. The names are read from the tokens,
  so a new type step or radius is understood here the moment it is declared.
*/
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: Object.keys(aquellecThemeExtensions.fontSize) }],
      rounded: [{ rounded: Object.keys(aquellecThemeExtensions.borderRadius) }],
      shadow: [{ shadow: Object.keys(aquellecThemeExtensions.boxShadow) }],
      ease: [{ ease: Object.keys(aquellecThemeExtensions.transitionTimingFunction) }],
      'font-family': [{ font: Object.keys(aquellecThemeExtensions.fontFamily) }],
    },
  },
});

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
