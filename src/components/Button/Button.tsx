import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRing, focusRingGhost } from '../../lib/focus-ring';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ai';
  /** Size preset affecting height, padding and font size. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner and disables interaction while an action is pending. */
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    /*
      `primary` and `ai` keep their saturated fill in dark mode — they are the
      page's call to action and have to stay the brightest thing on it. Only
      the neutral variants flip, since they are defined by the surface they
      sit on.
    */
    const variants = {
      primary: cn(
        'bg-brand-600 text-white hover:bg-brand-700',
        /*
          `brand-400` with near-black copy, measured at 6.33:1. `brand-500`
          under the same copy only reaches 4.17:1 and fails AA — the dark
          replay of the suite caught it.
        */
        'dark:bg-brand-400 dark:hover:bg-brand-300 dark:text-slate-950',
        focusRing
      ),
      secondary: cn(
        'bg-slate-100 text-slate-900 hover:bg-slate-200',
        'dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        focusRing
      ),
      outline: cn(
        'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700',
        'dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800',
        focusRing
      ),
      ghost: cn(
        'bg-transparent hover:bg-slate-100 text-slate-700',
        'dark:text-slate-200 dark:hover:bg-slate-800',
        focusRingGhost
      ),
      /*
        The gradient keeps its light-mode stops: brightening it to the `500`
        steps drops white copy to 4.23:1 over `ai-500`. It already reads as the
        brightest element on a dark page.
      */
      ai: cn(
        'bg-gradient-to-r from-ai-600 to-brand-600 text-white hover:opacity-95 shadow-xs',
        focusRing
      ),
    };

    /*
      Touch first: every size is at least 44px tall below the `sm` breakpoint,
      the target size recommended by WCAG 2.5.5. The desktop heights are
      restored from 640px, where the pointer is precise — so the compact look
      of `sm` and `md` is unchanged on the screens that can use it.
    */
    const sizes = {
      sm: 'h-11 px-3 text-xs sm:h-8',
      md: 'h-11 px-4 text-sm sm:h-10',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
