import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check, X, AlertTriangle, Sparkles } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'ai';
  size?: 'sm' | 'md';
  icon?: 'check' | 'cross' | 'warning' | 'ai' | 'none';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon = 'none',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';

  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    ai: 'bg-ai-50 text-ai-700 border border-ai-200/60 shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const renderIcon = () => {
    const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

    switch (icon) {
      case 'check':
        return <Check className={clsx(iconSizes, 'text-emerald-600')} />;
      case 'cross':
        return <X className={clsx(iconSizes, 'text-rose-600')} />;
      case 'warning':
        return <AlertTriangle className={clsx(iconSizes, 'text-amber-600')} />;
      case 'ai':
        return <Sparkles className={clsx(iconSizes, 'text-ai-600')} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
};
