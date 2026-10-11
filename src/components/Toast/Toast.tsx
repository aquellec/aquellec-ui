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
        /*
          Inherits its colour: the `ai` toast is an inverted surface, and a
          tinted icon on it is either invisible or a second accent.
        */
        case 'ai':
          return <Sparkles className={iconClass} aria-hidden="true" />;
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
          'flex w-full max-w-md items-start rounded-xl p-4 shadow-overlay',
          'transition-colors duration-150 ease-settle motion-reduce:transition-none',
          /*
            Composed last: the leading mark it carries is a `border-l-*`, which
            `tailwind-merge` drops if the `border` shorthand above arrives after
            it.
          */
          semanticSurfaceClass[variant],
          className
        )}
        {...props}
      >
        {renderIcon()}
        <div className="flex-1 mr-2 text-left">
          <p className="text-sm font-semibold leading-tight">{title}</p>
          {description && <p className="mt-1 text-xs leading-normal opacity-90">{description}</p>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-md p-1 transition-colors duration-150 ease-settle hover:bg-black/5 motion-reduce:transition-none dark:hover:bg-white/10',
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
