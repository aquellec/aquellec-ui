import React, { useId } from 'react';
import { cn } from '../../lib/cn';
import {
  controlBorderClass,
  errorTextClass,
  mutedTextClass,
  placeholderClass,
} from '../../lib/semantic-colors';
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
          <label htmlFor={id} className="mb-1.5 text-xs font-semibold text-ink-800 dark:text-ink-100">
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
            /*
              The left border is 2px at all times and only changes colour (brand
              on focus, brick on error), so the text does not shift on focus.
            */
            'w-full min-w-0 rounded-xl border border-l-2 transition-colors duration-150 ease-settle motion-reduce:transition-none',
            'bg-white text-ink-900 dark:bg-ink-900 dark:text-ink-50',
            placeholderClass,
            'p-3 text-sm',
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
        <div className="flex items-center justify-between mt-1 gap-2">
          {error ? (
            <span id={errorId} className={cn('text-xs', errorTextClass)} role="alert">
              {error}
            </span>
          ) : helperText ? (
            <span id={helperId} className={cn('text-xs', mutedTextClass)}>
              {helperText}
            </span>
          ) : (
            <span />
          )}
          {maxLength && (
            <span
              className={cn('flex-shrink-0 text-xs tabular-nums', mutedTextClass)}
              aria-live="polite"
            >
              {length} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
