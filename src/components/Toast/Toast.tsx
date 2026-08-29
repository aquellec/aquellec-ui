import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { semanticIconClass, semanticSurfaceClass, subtleTextClass } from '../../lib/semantic-colors';
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
  /** Accessible name of the dismiss button. */
  closeLabel?: string;
}

/** English default for the dismiss button. */
export const DEFAULT_TOAST_CLOSE_LABEL = 'Dismiss notification';

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      variant = 'info',
      title,
      description,
      onClose,
      closeLabel = DEFAULT_TOAST_CLOSE_LABEL,
      className,
      ...props
    },
    ref
  ) => {
    const liveRole = variant === 'error' ? 'alert' : 'status';

    const renderIcon = () => {
      const iconClass = 'w-5 h-5 flex-shrink-0 mt-0.5 mr-3';
      switch (variant) {
        case 'success':
          return <CheckCircle2 className={cn(iconClass, semanticIconClass.success)} aria-hidden="true" />;
        case 'error':
          return <AlertCircle className={cn(iconClass, semanticIconClass.danger)} aria-hidden="true" />;
        case 'warning':
          return <AlertTriangle className={cn(iconClass, semanticIconClass.warning)} aria-hidden="true" />;
        case 'ai':
          return <Sparkles className={cn(iconClass, semanticIconClass.ai)} aria-hidden="true" />;
        default:
          return <Info className={cn(iconClass, semanticIconClass.info)} aria-hidden="true" />;
      }
    };

    return (
      <div
        ref={ref}
        role={liveRole}
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        className={cn(
          'flex items-start p-4 rounded-xl border shadow-xs transition-all duration-200 max-w-md w-full',
          semanticSurfaceClass[variant],
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
            className={cn(
              'p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
              subtleTextClass,
              focusRingGhost
            )}
            aria-label={closeLabel}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
