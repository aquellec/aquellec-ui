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

/*
  In dark mode `primary` uses a lighter fill with dark text; the neutral
  variants follow their surface. Every variant has a 1px border (transparent
  when unused) so all variants share the same box size.
*/
const variants = {
  primary: cn(
    'bg-brand-600 text-white hover:bg-brand-700',
    /*
      `brand-400` under `ink-950` text: 5.73:1. White text on `brand-600` falls
      below AA on a dark page.
    */
    'dark:bg-brand-400 dark:text-ink-950 dark:hover:bg-brand-300',
    focusRing
  ),
  secondary: cn(
    'bg-ink-100 text-ink-900 hover:bg-ink-200',
    'dark:bg-ink-800 dark:text-ink-50 dark:hover:bg-ink-700',
    focusRing
  ),
  /*
    `ink-400` is the lightest step that clears the 3:1 required of a control
    boundary (WCAG 1.4.11).
  */
  outline: cn(
    'border-ink-400 bg-transparent text-ink-800 hover:border-ink-500 hover:bg-ink-50',
    'dark:border-ink-500 dark:text-ink-100 dark:hover:border-ink-400 dark:hover:bg-ink-800',
    focusRing
  ),
  ghost: cn(
    'bg-transparent text-ink-800 hover:bg-ink-100',
    'dark:text-ink-100 dark:hover:bg-ink-800',
    focusRingGhost
  ),
  /* Tonal brand: the `primary` hue at lower emphasis. */
  ai: cn(
    'bg-brand-50 text-brand-700 hover:bg-brand-100',
    'dark:bg-brand-500/20 dark:text-brand-100 dark:hover:bg-brand-500/30',
    focusRing
  ),
} as const;

/*
  Below the `sm` breakpoint every size is at least 44px tall (WCAG 2.5.5 target
  size); desktop heights apply from 640px.
*/
const sizes = {
  sm: 'h-11 px-3 text-xs sm:h-8',
  md: 'h-11 px-4 text-sm sm:h-10',
  lg: 'h-12 px-7 text-base',
} as const;

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

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          'inline-flex items-center justify-center rounded-xl border border-transparent font-semibold',
          'transition-colors duration-150 ease-settle motion-reduce:transition-none',
          'disabled:opacity-50 disabled:pointer-events-none',
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
