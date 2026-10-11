/*
  Shared colour pairs, each carrying its light value and its `dark:` counterpart.

  Dark mode lives here rather than being spelled out in every component: a tone
  used in nine places must shift identically in all nine, and a reviewer has to
  be able to read the whole palette in one file. Components compose these
  constants and only inline a `dark:` utility when a case is genuinely unique.

  Every value resolves to a token from `src/lib/design-tokens.ts`.

  SURFACES WITHOUT BOXES
  In light mode the page is white and a raised surface is also white. They are
  told apart by elevation and by space, not by a tinted rectangle with a grey
  line around it. That is the single biggest change this direction makes to the
  rendered product: outlines are reserved for controls, where the boundary is
  functional, and for the one card variant whose whole job is to be outlined.

  That inversion does not survive on a dark canvas — a shadow needs something to
  fall on. So in dark mode elevation is carried by the surface step itself, each
  level a shade *lighter* than the one below. Same ladder, different physics,
  one mental model.
*/

/** Icon colours on tinted backgrounds (WCAG AA, measured against each tint). */
export const semanticIconClass = {
  success: 'text-semantic-success-fg dark:text-moss-300',
  danger: 'text-semantic-error-fg dark:text-brick-300',
  warning: 'text-semantic-warning-fg dark:text-ochre-300',
  /* The brand hue at low emphasis. Not a status, so never green, amber or red. */
  ai: 'text-brand-700 dark:text-brand-300',
  info: 'text-semantic-info-fg dark:text-brand-300',
} as const;

/*
  THE TEXT LADDER, SYMMETRICAL

  Light runs 900 · 700 · 600 · 500 from strong to muted; dark runs 50 · 100 ·
  200 · 300 back up. Four steps either way, one mental model.

  Dark stops at `ink-300` rather than reaching for the `-400` the eye would
  guess at: the dark suite caught `#918978` sitting at 4.01:1 on a sunken
  surface, which looks perfectly muted and fails AA. Muted copy on a dark
  ground has to be brighter than it feels like it should be — captions are read
  by exactly the people a thin grey excludes.
*/

/** Muted copy: captions, hints, secondary metadata. 5.34:1 on white, 9.08:1 on ink-800. */
export const mutedTextClass = 'text-semantic-muted dark:text-ink-300';

/** Secondary copy and controls. 7.15:1 on white. */
export const subtleTextClass = 'text-semantic-subtle dark:text-ink-200';

/** Form validation errors. 8.70:1 on white. */
export const errorTextClass = 'text-semantic-error-fg dark:text-brick-300';

/** Placeholder tone. Muted, never lighter — a placeholder is still content. */
export const placeholderClass = 'placeholder:text-semantic-muted dark:placeholder:text-ink-300';

/*
  Toast and banner surfaces.

  A notification is identified by its fill and by the icon and words inside it —
  not by an accent bar down its edge, which is the placement this system
  retired. `ai` is tonal cobalt rather than a hue of its own, because a
  machine's contribution is not a status and must not look like one.
*/
export const semanticSurfaceClass = {
  success: 'bg-moss-100 text-moss-900 dark:bg-moss-500/20 dark:text-moss-100',
  error: 'bg-brick-100 text-brick-900 dark:bg-brick-500/20 dark:text-brick-100',
  warning: 'bg-ochre-100 text-ochre-900 dark:bg-ochre-500/20 dark:text-ochre-100',
  info: 'bg-brand-100 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
  /* Tonal cobalt: the brand hue at low emphasis, never a fourth status colour. */
  ai: 'bg-brand-50 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
} as const;

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Page canvas behind the content: dashboards, full-screen templates.
 *
 * White, not a tint. A coloured canvas with white cards floating on it is the
 * look this direction was rewritten to remove: it reads timid, it wastes the
 * strongest contrast available, and it forces every surface to justify itself
 * with a border.
 */
export const pageSurfaceClass = 'bg-white dark:bg-ink-950';

/** Raised surface: cards, dialogs, popovers, anything sitting on the page. */
export const raisedSurfaceClass = 'bg-white dark:bg-ink-900';

/**
 * Inverted surface.
 *
 * RETAINED FOR COMPATIBILITY and no longer used by the library. A full-bleed
 * near-black band was tried as the hero and read brutal rather than premium:
 * in this register black is ink, not a fill. The hero now sits on `ink-50` and
 * gets its weight from the size of the numeral. The constant stays exported
 * because a consumer may already compose it.
 */
export const invertedSurfaceClass = 'bg-ink-950 text-ink-50 dark:bg-ink-900';

/** Sunken surface inside a raised one: table head, footers, ghost fills. */
export const sunkenSurfaceClass = 'bg-ink-50 dark:bg-ink-800';

/**
 * Outer border of a surface, for the few places one is still warranted.
 *
 * Kept for structural containers a reader has to scroll inside — a table, a
 * dialog — and for the `outline` card, whose entire purpose is to be drawn.
 * Everything else uses elevation. If you are reaching for this to separate two
 * blocks, the answer is space.
 */
export const surfaceBorderClass = 'border-ink-200 dark:border-ink-700';

/** Hairline separating rows or sections inside a surface. */
export const dividerBorderClass = 'border-ink-100 dark:border-ink-800';

/**
 * Border of an interactive control: inputs, outline buttons, drop zones.
 *
 * `ink-400` and not the customary `-300`: measured at 3.47:1 against white and
 * 3.15:1 against a dark card, it is the lightest step that clears the 3:1 WCAG
 * 1.4.11 asks of a control boundary. Most systems draw an input people with low
 * vision cannot find. A field you can see the edge of is not a heavy field, it
 * is a finished one.
 */
export const controlBorderClass = 'border-ink-400 dark:border-ink-500';

/* -------------------------------------------------------------------------- */
/*  Copy                                                                       */
/* -------------------------------------------------------------------------- */

/** Headings and primary copy on any surface. */
export const strongTextClass = 'text-ink-900 dark:text-ink-50';

/** Body copy on any surface. */
export const bodyTextClass = 'text-ink-700 dark:text-ink-100';

/** Brand accent used for links, icons and emphasis. */
export const brandAccentClass = 'text-brand-700 dark:text-brand-300';

/**
 * AI emphasis — ink, not an accent.
 *
 * Retained under its original name because it is exported, but it no longer
 * names a hue: a machine's contribution is marked by inversion, and the system
 * has exactly one non-semantic colour.
 */
export const aiAccentClass = 'text-ink-900 dark:text-ink-50';
