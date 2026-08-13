/** Icon colors on tinted backgrounds (WCAG AA 3:1 UI contrast). */
export const semanticIconClass = {
  success: 'text-semantic-success-fg',
  danger: 'text-semantic-error-fg',
  warning: 'text-semantic-warning-fg',
  ai: 'text-ai-700',
  info: 'text-semantic-info-fg',
} as const;

/** Muted copy on white backgrounds (WCAG AA 4.5:1). */
export const mutedTextClass = 'text-semantic-muted';

/** Secondary copy and controls on white backgrounds (WCAG AA 4.5:1). */
export const subtleTextClass = 'text-semantic-subtle';

/** Form validation errors (WCAG AA 4.5:1 on white). */
export const errorTextClass = 'text-semantic-error-fg';

/** Placeholder tone (WCAG AA 4.5:1 on white). */
export const placeholderClass = 'placeholder:text-semantic-muted';

/** Toast and banner surface tokens mapped to the preset. */
export const semanticSurfaceClass = {
  success: 'bg-semantic-success-surface/90 border-semantic-success-border text-emerald-900',
  error: 'bg-semantic-error-surface/90 border-semantic-error-border text-rose-900',
  warning: 'bg-semantic-warning-surface/90 border-semantic-warning-border text-amber-900',
  info: 'bg-semantic-info-surface/90 border-semantic-info-border text-blue-900',
  ai: 'bg-gradient-to-r from-ai-50/90 to-brand-50/90 border-ai-200 text-slate-800',
} as const;
