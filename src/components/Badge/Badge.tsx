import React from 'react';
import { Check, X, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/cn';
import { semanticIconClass } from '../../lib/semantic-colors';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color scheme reflecting ATS semantic meaning. */
  variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'ai';
  /** Compact or default padding preset. */
  size?: 'sm' | 'md';
  /** Optional leading icon illustrating the badge meaning. */
  icon?: 'check' | 'cross' | 'warning' | 'ai' | 'none';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      icon = 'none',
      children,
      className,
      ...props
    },
    ref
  ) => {
    /*
      Dark variants are a wash of the hue over the surface — `500/15` on the
      background, `500/30` on the border — rather than the `50` tint, which
      turns into a near-white block on a dark card.
    */
    const variants = {
      success:
        'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
      danger:
        'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
      warning:
        'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      neutral:
        'bg-neutral-100 text-neutral-700 border border-neutral-200/60 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700',
      ai: 'bg-ai-50 text-ai-700 border border-ai-200/60 shadow-xs dark:bg-ai-500/15 dark:text-ai-300 dark:border-ai-500/30',
    };

    const sizes = {
      sm: 'text-caption px-2 py-0.5 gap-1',
      md: 'text-caption px-2.5 py-1 gap-1.5',
    };

    const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

    const renderIcon = () => {
      switch (icon) {
        case 'check':
          return <Check className={cn(iconSizes, semanticIconClass.success)} aria-hidden="true" />;
        case 'cross':
          return <X className={cn(iconSizes, semanticIconClass.danger)} aria-hidden="true" />;
        case 'warning':
          return <AlertTriangle className={cn(iconSizes, semanticIconClass.warning)} aria-hidden="true" />;
        case 'ai':
          return <Sparkles className={cn(iconSizes, semanticIconClass.ai)} aria-hidden="true" />;
        default:
          return null;
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          /*
            `whitespace-nowrap`: a status badge is a label, never a paragraph.
            In a narrow table cell it would otherwise wrap and get clipped.
          */
          'inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {renderIcon()}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
