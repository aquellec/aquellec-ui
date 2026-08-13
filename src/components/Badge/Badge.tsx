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
    const variants = {
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
      ai: 'bg-ai-50 text-ai-700 border border-ai-200/60 shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-xs px-2.5 py-1 gap-1.5',
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
          'inline-flex items-center font-medium rounded-full transition-colors',
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
