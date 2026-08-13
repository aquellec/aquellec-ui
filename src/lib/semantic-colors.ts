/** Icon colors on tinted backgrounds (WCAG AA 3:1 UI contrast). */
export const semanticIconClass = {
  success: 'text-emerald-700',
  danger: 'text-rose-700',
  warning: 'text-amber-800',
  ai: 'text-ai-700',
  info: 'text-blue-600',
} as const;

/** Muted copy on white backgrounds (WCAG AA 4.5:1). */
export const mutedTextClass = 'text-slate-500';

/** Secondary copy and controls on white backgrounds (WCAG AA 4.5:1). */
export const subtleTextClass = 'text-slate-600';

/** Form validation errors (WCAG AA 4.5:1 on white). */
export const errorTextClass = 'text-rose-700';

/** Placeholder tone (WCAG AA 4.5:1 on white). */
export const placeholderClass = 'placeholder:text-slate-500';
