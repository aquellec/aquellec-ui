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

      Every variant carries a 1px transparent border so the box is identical
      across the set, whether or not the variant draws on it. A variant that
      changes its own height when you swap it is a variant nobody trusts.
    */
    const variants = {
      primary: cn(
        'bg-brand-600 text-white hover:bg-brand-700',
        /*
          `brand-400` with near-black copy, measured at 5.73:1. The saturated
          `-600` fill that works on white drops white copy below AA once the
          page behind it is dark, so the pair inverts rather than dims.
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
        Drawn rather than filled, at `ink-400` — the lightest step that still
        clears the 3:1 WCAG asks of a control boundary. It ran at two pixels of
        full ink for one pass and turned every secondary action into a hard
        black frame, which is the register this refinement exists to leave.
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
      /*
        Tonal cobalt: the brand hue at low emphasis.

        `primary` is the solid fill and `ai` is the same colour held back — a
        machine-assisted action is worth marking, and worth marking *quietly*,
        because it is offered rather than urged. It was a solid black button for
        one pass, which made the loudest control on the page the one nobody had
        asked for.
      */
      ai: cn(
        'bg-brand-50 text-brand-700 hover:bg-brand-100',
        'dark:bg-brand-500/20 dark:text-brand-100 dark:hover:bg-brand-500/30',
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
      lg: 'h-12 px-7 text-base',
    };

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
