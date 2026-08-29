import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import { errorTextClass, mutedTextClass, placeholderClass } from '../../lib/semantic-colors';
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
          <label htmlFor={id} className="mb-1.5 text-caption font-semibold text-neutral-700 dark:text-neutral-200">
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
            'w-full min-w-0 rounded-control border px-3 py-2.5 text-caption transition-all duration-150',
            'bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100',
            placeholderClass,
            error
              ? cn('border-rose-300 dark:border-rose-500/60', focusRingDanger)
              : cn(
                  'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500',
                  focusRing
                ),
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <div className="mt-1 space-y-1">
            {error && (
              <span id={errorId} className={cn('block text-caption', errorTextClass)} role="alert">
                {error}
              </span>
            )}
            {helperText && (
              <span id={helperId} className={cn('block text-caption', mutedTextClass)}>
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
