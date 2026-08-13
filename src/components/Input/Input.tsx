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
          <label htmlFor={id} className="mb-1.5 text-xs font-semibold text-slate-700">
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
            'w-full min-w-0 rounded-xl border bg-white px-3 py-2.5 text-xs text-slate-800 transition-all duration-150',
            placeholderClass,
            error
              ? cn('border-rose-300', focusRingDanger)
              : cn('border-slate-300 hover:border-slate-400', focusRing),
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <div className="mt-1 space-y-1">
            {error && (
              <span id={errorId} className={cn('block text-[11px]', errorTextClass)} role="alert">
                {error}
              </span>
            )}
            {helperText && (
              <span id={helperId} className={cn('block text-[11px]', mutedTextClass)}>
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
