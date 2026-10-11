/*
  The outline is written out instead of `outline-none`: in Tailwind 3 that
  utility emits `outline: 2px solid transparent`, which keeps focus visible in
  forced-colors mode where box-shadow rings are dropped, but in Tailwind 4 it
  means `outline-style: none`. The package supports both majors.

  `ring-offset-*` is pinned to the surface colour; left at its white default it
  draws a white halo around focused controls in dark mode.
*/

/** Default accessible focus ring for interactive controls. */
export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-brand-400 dark:ring-offset-ink-900';

/** Focus ring for destructive or error states. */
export const focusRingDanger =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-brick-600 focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-brick-400 dark:ring-offset-ink-900';

/** Subtle focus ring for ghost/text buttons. */
export const focusRingGhost =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-ink-500 focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-ink-400 dark:ring-offset-ink-900';
