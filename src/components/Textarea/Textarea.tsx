import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import { errorTextClass, mutedTextClass, placeholderClass } from '../../lib/semantic-colors';
import { focusRing, focusRingDanger } from '../../lib/focus-ring';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label linked to the textarea via `htmlFor`. */
  label?: string;
  /** Validation error message displayed below the field. */
  error?: string;
  /** Helper text shown when no error is present. */
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      id: idProp,
      rows = 4,
      maxLength,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const [length, setLength] = React.useState(() => {
      if (typeof value === 'string') return value.length;
      if (typeof defaultValue === 'string') return defaultValue.length;
      return 0;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) setLength(e.target.value.length);
      onChange?.(e);
    };

    React.useEffect(() => {
      if (typeof value === 'string') setLength(value.length);
    }, [value]);

    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className="w-full flex flex-col text-left">
        {label && (
          <label htmlFor={id} className="text-caption font-semibold text-neutral-700 dark:text-neutral-200 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full p-3 text-caption rounded-control border transition-all duration-150',
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
        <div className="flex items-center justify-between mt-1 gap-2">
          {error ? (
            <span id={errorId} className={cn('text-caption', errorTextClass)} role="alert">
              {error}
            </span>
          ) : helperText ? (
            <span id={helperId} className={cn('text-caption', mutedTextClass)}>
              {helperText}
            </span>
          ) : (
            <span />
          )}
          {maxLength && (
            <span className={cn('text-caption flex-shrink-0', mutedTextClass)} aria-live="polite">
              {length} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
