/*
  Rule and tick classes. Written with numeric utilities (`h-px`, `w-0.5`), which
  resolve to the same pixels in Tailwind 3 and 4; Tailwind 4 has no theme
  namespace for a named border width.
*/

/** Accent keys accepted by `leadingMarkClass`. */
export type MarkAccent = 'brand' | 'ai' | 'success' | 'warning' | 'danger' | 'neutral';

/** Leading border accent. Kept for compatibility: exported, but not used by any component. */
export const leadingMarkClass: Record<MarkAccent, string> = {
  brand: 'border-l-4 border-l-brand-600 dark:border-l-brand-400',
  ai: 'border-l-4 border-l-ai-500 dark:border-l-ai-400',
  success: 'border-l-4 border-l-moss-600 dark:border-l-moss-400',
  warning: 'border-l-4 border-l-ochre-600 dark:border-l-ochre-400',
  danger: 'border-l-4 border-l-brick-600 dark:border-l-brick-400',
  neutral: 'border-l-4 border-l-ink-900 dark:border-l-ink-100',
};

/** 1px divider under a heading. */
export const mastheadRuleClass = 'h-px w-full bg-ink-200 dark:bg-ink-800';

/**
 * Threshold tick across a horizontal track, positioned by the component. Uses
 * the text ink at reduced opacity so it stays distinct from the fill.
 */
export const thresholdMarkClass =
  'absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ink-900/45 dark:bg-ink-50/45';

/** Threshold tick for SVG tracks. Same tone as `thresholdMarkClass`. */
export const thresholdStrokeClass = 'stroke-ink-900/45 dark:stroke-ink-50/45';

/** Short brand-coloured rule placed before an eyebrow label. */
export const ruleMarkClass = 'h-0.5 w-6 rounded-full bg-brand-600 dark:bg-brand-400';

/** Tabular figures, so digits align across rows and do not shift as values change. */
export const dataFigureClass = 'tabular-nums';
