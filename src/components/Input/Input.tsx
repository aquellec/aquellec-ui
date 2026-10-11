import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import {
  controlBorderClass,
  errorTextClass,
  mutedTextClass,
  placeholderClass,
} from '../../lib/semantic-colors';
import { focusRing, focusRingDanger } from '../../lib/focus-ring';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label linked to the input via `htmlFor`. */
  label?: string;
  /** Validation error message displayed below the field. */
  error?: string;
  /** Helper text shown when no error is present. */
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id: idProp, type = 'text', required, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const describedBy =
      [error ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined;

    return (
      <div className="flex w-full min-w-0 flex-col text-left">
        {label && (
          <label htmlFor={id} className="mb-1.5 text-xs font-semibold text-ink-800 dark:text-ink-100">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          aria-invalid={Boolean(error)}
          aria-required={required}
          aria-describedby={describedBy}
          className={cn(
            /*
              The left border is 2px at all times and only changes colour (brand
              on focus, brick on error), so the text does not shift on focus.
            */
            'w-full min-w-0 rounded-xl border border-l-2 transition-colors duration-150 ease-settle motion-reduce:transition-none',
            'bg-white text-ink-900 dark:bg-ink-900 dark:text-ink-50',
            placeholderClass,
            'px-3 py-2.5 text-sm',
            error
              ? cn(
                  'border-brick-400 border-l-brick-600 dark:border-brick-500 dark:border-l-brick-400',
                  focusRingDanger
                )
              : cn(
                  controlBorderClass,
                  'border-l-ink-400 hover:border-ink-500 dark:border-l-ink-500 dark:hover:border-ink-400',
                  'focus:border-l-brand-600 dark:focus:border-l-brand-400',
                  focusRing
                ),
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <div className="mt-1 space-y-1">
            {error && (
              <span id={errorId} className={cn('block text-xs', errorTextClass)} role="alert">
                {error}
              </span>
            )}
            {helperText && (
              <span id={helperId} className={cn('block text-xs', mutedTextClass)}>
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
