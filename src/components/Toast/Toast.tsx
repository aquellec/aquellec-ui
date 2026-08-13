import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles, X } from 'lucide-react';

export interface ToastProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'ai';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  description,
  onClose,
  className,
}) => {
  const baseStyles = 'flex items-start p-4 rounded-xl border shadow-sm transition-all duration-200 max-w-md w-full';

  const variants = {
    success: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50/90 border-rose-200 text-rose-900',
    warning: 'bg-amber-50/90 border-amber-200 text-amber-900',
    info: 'bg-blue-50/90 border-blue-200 text-blue-900',
    ai: 'bg-gradient-to-r from-ai-50/90 to-brand-50/90 border-ai-200 text-slate-800',
  };

  const renderIcon = () => {
    const iconClass = 'w-5 h-5 flex-shrink-0 mt-0.5 mr-3';
    switch (variant) {
      case 'success':
        return <CheckCircle2 className={clsx(iconClass, 'text-emerald-600')} />;
      case 'error':
        return <AlertCircle className={clsx(iconClass, 'text-rose-600')} />;
      case 'warning':
        return <AlertTriangle className={clsx(iconClass, 'text-amber-600')} />;
      case 'ai':
        return <Sparkles className={clsx(iconClass, 'text-ai-600')} />;
      default:
        return <Info className={clsx(iconClass, 'text-blue-600')} />;
    }
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))}>
      {renderIcon()}
      <div className="flex-1 mr-2 text-left">
        <h4 className="text-xs font-bold leading-tight">{title}</h4>
        {description && <p className="text-xs opacity-90 mt-1 leading-normal">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
