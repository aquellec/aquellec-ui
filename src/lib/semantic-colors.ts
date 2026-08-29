/*
  Shared color pairs, each carrying its light value and its `dark:` counterpart.

  Dark mode lives here rather than being spelled out in every component: a tone
  used in nine places must shift identically in all nine, and a reviewer has to
  be able to read the whole palette in one file. Components compose these
  constants and only inline a `dark:` utility when a case is genuinely unique.

  The dark ramp is built on `slate` for surfaces and on the semantic hue at low
  opacity for tinted areas, so a tinted panel reads as a wash over the surface
  instead of a solid block that floats above it.
*/

/** Icon colors on tinted backgrounds (WCAG AA 3:1 UI contrast). */
export const semanticIconClass = {
  success: 'text-semantic-success-fg dark:text-emerald-300',
  danger: 'text-semantic-error-fg dark:text-rose-300',
  warning: 'text-semantic-warning-fg dark:text-amber-300',
  ai: 'text-ai-700 dark:text-ai-300',
  info: 'text-semantic-info-fg dark:text-blue-300',
} as const;

/** Muted copy: captions, hints, secondary metadata (WCAG AA 4.5:1). */
export const mutedTextClass = 'text-semantic-muted dark:text-slate-400';

/** Secondary copy and controls (WCAG AA 4.5:1). */
export const subtleTextClass = 'text-semantic-subtle dark:text-slate-300';

/** Form validation errors (WCAG AA 4.5:1). */
export const errorTextClass = 'text-semantic-error-fg dark:text-rose-300';

/** Placeholder tone (WCAG AA 4.5:1). */
export const placeholderClass =
  'placeholder:text-semantic-muted dark:placeholder:text-slate-500';

/** Toast and banner surface tokens mapped to the preset. */
export const semanticSurfaceClass = {
  success:
    'bg-semantic-success-surface/90 border-semantic-success-border text-emerald-900 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-100',
  error:
    'bg-semantic-error-surface/90 border-semantic-error-border text-rose-900 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-100',
  warning:
    'bg-semantic-warning-surface/90 border-semantic-warning-border text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-100',
  info: 'bg-semantic-info-surface/90 border-semantic-info-border text-blue-900 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-100',
  ai: 'bg-gradient-to-r from-ai-50/90 to-brand-50/90 border-ai-200 text-slate-800 dark:from-ai-500/15 dark:to-brand-500/15 dark:border-ai-500/30 dark:text-slate-100',
} as const;

/* -------------------------------------------------------------------------- */
/*  Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

/** Page canvas behind the content: dashboards, full-screen templates. */
export const pageSurfaceClass = 'bg-slate-50 dark:bg-slate-950';

/** Raised surface: cards, dialogs, popovers, anything sitting on the page. */
export const raisedSurfaceClass = 'bg-white dark:bg-slate-900';

/** Sunken surface inside a raised one: table head, footers, ghost fills. */
export const sunkenSurfaceClass = 'bg-slate-50 dark:bg-slate-800/60';

/** Outer border of a raised surface. */
export const surfaceBorderClass = 'border-slate-200 dark:border-slate-700';

/** Hairline separating rows or sections inside a surface. */
export const dividerBorderClass = 'border-slate-100 dark:border-slate-800';

/** Border of an interactive control: inputs, outline buttons, drop zones. */
export const controlBorderClass = 'border-slate-300 dark:border-slate-600';

/* -------------------------------------------------------------------------- */
/*  Copy                                                                       */
/* -------------------------------------------------------------------------- */

/** Headings and primary copy on any surface. */
export const strongTextClass = 'text-slate-900 dark:text-slate-50';

/** Body copy on any surface. */
export const bodyTextClass = 'text-slate-700 dark:text-slate-200';

/** Brand accent used for links, icons and emphasis. */
export const brandAccentClass = 'text-brand-600 dark:text-brand-300';

/** AI accent, for generative features. */
export const aiAccentClass = 'text-ai-600 dark:text-ai-300';
