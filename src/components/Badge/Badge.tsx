import React from 'react';
import { Check, X, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour variant. */
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
      Status variants use a solid fill: `-700` under white text in light mode
      (7.12 to 8.59:1), `-400` under `ink-950` in dark mode (6.16 to 8.12:1).
      The text label carries the meaning without relying on colour. `ai` uses
      tonal brand values so it is not read as a status.
    */
    const variants = {
      success: 'bg-moss-700 text-white dark:bg-moss-400 dark:text-ink-950',
      danger: 'bg-brick-700 text-white dark:bg-brick-400 dark:text-ink-950',
      warning: 'bg-ochre-700 text-white dark:bg-ochre-400 dark:text-ink-950',
      neutral: 'bg-ink-100 text-ink-800 dark:bg-ink-800 dark:text-ink-100',
      ai: 'bg-brand-100 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
    };

    /*
      Fixed heights rather than vertical padding, so badges side by side align
      regardless of content.
    */
    const sizes = {
      sm: 'h-5 text-xs px-2 gap-1',
      md: 'h-6 text-xs px-2.5 gap-1.5',
    };

    const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

    /* The icon uses the badge text colour. */
    const renderIcon = () => {
      switch (icon) {
        case 'check':
          return <Check className={iconSizes} aria-hidden="true" />;
        case 'cross':
          return <X className={iconSizes} aria-hidden="true" />;
        case 'warning':
          return <AlertTriangle className={iconSizes} aria-hidden="true" />;
        case 'ai':
          return <Sparkles className={iconSizes} aria-hidden="true" />;
        default:
          return null;
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          /* `whitespace-nowrap` prevents wrapping and clipping in narrow table cells. */
          'inline-flex items-center whitespace-nowrap rounded-md font-semibold uppercase tracking-wide',
          'transition-colors duration-150 ease-settle motion-reduce:transition-none',
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
