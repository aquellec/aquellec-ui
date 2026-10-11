/*
  Shared colour classes, each pairing a light value with its `dark:`
  counterpart, so a tone used in several components shifts identically
  everywhere. Every value resolves to a token from `src/lib/design-tokens.ts`.

  In light mode a raised surface is white on a white page and is separated by
  elevation. In dark mode elevation is carried by a lighter surface step
  instead, since a shadow is not visible on a near-black canvas.
*/

/** Icon colours on tinted backgrounds (WCAG AA, measured against each tint). */
export const semanticIconClass = {
  success: 'text-semantic-success-fg dark:text-moss-300',
  danger: 'text-semantic-error-fg dark:text-brick-300',
  warning: 'text-semantic-warning-fg dark:text-ochre-300',
  /* Brand hue, kept distinct from the status colours. */
  ai: 'text-brand-700 dark:text-brand-300',
  info: 'text-semantic-info-fg dark:text-brand-300',
} as const;

/*
  Text ladder: light uses 900 · 700 · 600 · 500, dark uses 50 · 100 · 200 · 300.
  Dark stops at `ink-300` because `-400` does not reach 4.5:1 on dark surfaces.
*/

/** Muted text. 5.55:1 on white, 9.51:1 on ink-800. */
export const mutedTextClass = 'text-semantic-muted dark:text-ink-300';

/** Subtle text and controls. 8.28:1 on white. */
export const subtleTextClass = 'text-semantic-subtle dark:text-ink-200';

/** Form validation errors. 8.50:1 on white. */
export const errorTextClass = 'text-semantic-error-fg dark:text-brick-300';

/** Placeholder text, at the muted tone. */
export const placeholderClass = 'placeholder:text-semantic-muted dark:placeholder:text-ink-300';

/*
  Toast and banner surfaces. A status is identified by fill, icon and text; `ai`
  uses tonal brand values so it is not mistaken for a status.
*/
export const semanticSurfaceClass = {
  success: 'bg-moss-100 text-moss-900 dark:bg-moss-500/20 dark:text-moss-100',
  error: 'bg-brick-100 text-brick-900 dark:bg-brick-500/20 dark:text-brick-100',
  warning: 'bg-ochre-100 text-ochre-900 dark:bg-ochre-500/20 dark:text-ochre-100',
  info: 'bg-brand-100 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
  /* Tonal brand, not a status colour. */
  ai: 'bg-brand-50 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
} as const;

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Page canvas. White in light mode; surfaces are separated from it by elevation
 * rather than by a tinted background.
 */
export const pageSurfaceClass = 'bg-white dark:bg-ink-950';

/** Raised surface: cards, dialogs, popovers. */
export const raisedSurfaceClass = 'bg-white dark:bg-ink-900';

/** Inverted surface. Kept for compatibility: exported, but not used by any component. */
export const invertedSurfaceClass = 'bg-ink-950 text-ink-50 dark:bg-ink-900';

/** Sunken surface inside a raised one: table header, footers, ghost fills. */
export const sunkenSurfaceClass = 'bg-ink-50 dark:bg-ink-800';

/** Outer border for scrollable containers (tables, dialogs) and the `outline` card. */
export const surfaceBorderClass = 'border-ink-200 dark:border-ink-700';

/** Hairline separating rows or sections inside a surface. */
export const dividerBorderClass = 'border-ink-100 dark:border-ink-800';

/**
 * Border of interactive controls. `ink-400` (3.44:1 on white) and `ink-500` in
 * dark mode (3.34:1 on `ink-900`) are the lightest steps that clear the 3:1
 * required of a control boundary (WCAG 1.4.11).
 */
export const controlBorderClass = 'border-ink-400 dark:border-ink-500';

/* -------------------------------------------------------------------------- */
/*  Copy                                                                       */
/* -------------------------------------------------------------------------- */

/** Headings and primary text. */
export const strongTextClass = 'text-ink-900 dark:text-ink-50';

/** Body text. */
export const bodyTextClass = 'text-ink-700 dark:text-ink-100';

/** Brand accent used for links, icons and emphasis. */
export const brandAccentClass = 'text-brand-700 dark:text-brand-300';

/**
 * Kept under its original name because it is exported. Resolves to the strong
 * text colour; AI content uses `semanticSurfaceClass.ai`.
 */
export const aiAccentClass = 'text-ink-900 dark:text-ink-50';
