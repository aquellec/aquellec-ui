import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRingGhost } from '../../lib/focus-ring';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic tone driving colors and ARIA live politeness. */
  variant?: 'success' | 'error' | 'warning' | 'info' | 'ai';
  /** Primary notification headline. */
  title: string;
  /** Optional supporting detail text. */
  description?: string;
  /** When provided, renders a dismiss button and calls this handler on click. */
  onClose?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = 'info', title, description, onClose, className, ...props }, ref) => {
    const variants = {
      success: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
      error: 'bg-rose-50/90 border-rose-200 text-rose-900',
      warning: 'bg-amber-50/90 border-amber-200 text-amber-900',
      info: 'bg-blue-50/90 border-blue-200 text-blue-900',
      ai: 'bg-gradient-to-r from-ai-50/90 to-brand-50/90 border-ai-200 text-slate-800',
    };

    const liveRole = variant === 'error' ? 'alert' : 'status';

    const renderIcon = () => {
      const iconClass = 'w-5 h-5 flex-shrink-0 mt-0.5 mr-3';
      switch (variant) {
        case 'success':
          return <CheckCircle2 className={cn(iconClass, 'text-emerald-600')} aria-hidden="true" />;
        case 'error':
          return <AlertCircle className={cn(iconClass, 'text-rose-600')} aria-hidden="true" />;
        case 'warning':
          return <AlertTriangle className={cn(iconClass, 'text-amber-600')} aria-hidden="true" />;
        case 'ai':
          return <Sparkles className={cn(iconClass, 'text-ai-600')} aria-hidden="true" />;
        default:
          return <Info className={cn(iconClass, 'text-blue-600')} aria-hidden="true" />;
      }
    };

    return (
      <div
        ref={ref}
        role={liveRole}
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        className={cn(
          'flex items-start p-4 rounded-xl border shadow-sm transition-all duration-200 max-w-md w-full',
          variants[variant],
          className
        )}
        {...props}
      >
        {renderIcon()}
        <div className="flex-1 mr-2 text-left">
          <p className="text-xs font-bold leading-tight">{title}</p>
          {description && <p className="text-xs opacity-90 mt-1 leading-normal">{description}</p>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn('p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors', focusRingGhost)}
            aria-label="Fermer la notification"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
