import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, maxLength, value, defaultValue, onChange, ...props }, ref) => {
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
          className={twMerge(
            clsx(
              'w-full p-3 text-xs bg-white text-slate-800 rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 placeholder:text-slate-400',
              error
                ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400'
                : 'border-slate-300 hover:border-slate-400 focus:ring-brand-500 focus:border-brand-500',
              className
            )
          )}
          {...props}
        />
        <div className="flex items-center justify-between mt-1 gap-2">
          {error ? (
            <span className="text-[11px] text-rose-500">{error}</span>
          ) : helperText ? (
            <span className="text-[11px] text-slate-400">{helperText}</span>
          ) : (
            <span />
          )}
          {maxLength && (
            <span className="text-[11px] text-slate-400 flex-shrink-0">
              {length} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
