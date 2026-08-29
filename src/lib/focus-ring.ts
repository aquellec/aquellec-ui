/*
  `ring-offset-*` paints the gap between the control and the ring with a solid
  color, white by default. Left unset it draws a white halo around every focused
  control in dark mode, so each ring pins the offset to the surface it sits on.
*/

/** Default accessible focus ring for interactive controls. */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-brand-400 dark:ring-offset-slate-900';

/** Focus ring for destructive or error states. */
export const focusRingDanger =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 ring-offset-white dark:ring-offset-slate-900';

/** Subtle focus ring for ghost/text buttons. */
export const focusRingGhost =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ring-offset-white dark:focus-visible:ring-slate-500 dark:ring-offset-slate-900';
