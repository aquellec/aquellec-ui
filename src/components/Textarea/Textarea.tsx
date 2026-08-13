import React, { useId } from 'react';
import { cn } from '../../lib/cn';
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
          <label htmlFor={id} className="text-xs font-semibold text-slate-700 mb-1.5">
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
            'w-full p-3 text-xs bg-white text-slate-800 rounded-xl border transition-all duration-150 placeholder:text-slate-400',
            error
              ? cn('border-rose-300', focusRingDanger)
              : cn('border-slate-300 hover:border-slate-400', focusRing),
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between mt-1 gap-2">
          {error ? (
            <span id={errorId} className="text-[11px] text-rose-500" role="alert">
              {error}
            </span>
          ) : helperText ? (
            <span id={helperId} className="text-[11px] text-slate-400">
              {helperText}
            </span>
          ) : (
            <span />
          )}
          {maxLength && (
            <span className="text-[11px] text-slate-400 flex-shrink-0" aria-live="polite">
              {length} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
