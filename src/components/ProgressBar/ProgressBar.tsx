import React from 'react';
import { cn } from '../../lib/cn';
import { mutedTextClass } from '../../lib/semantic-colors';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value, expressed in the same unit as `max`. */
  value: number;
  /** Maximum value. Zero or negative renders an empty bar. */
  max: number;
  /** Visible label describing what is measured. Also acts as accessible name. */
  label?: string;
  /**
   * Accessible name of the bar when no visible `label` is rendered.
   * An unnamed `progressbar` is an axe violation (`aria-progressbar-name`).
   */
  ariaLabel?: string;
  /** Optional illustration placed before the label. Rendered as decorative. */
  icon?: React.ReactNode;
  /** Secondary text under the bar (context, tier, plan reminder). */
  helperText?: React.ReactNode;
  /** Action element aligned to the right of `helperText` (link, button). */
  action?: React.ReactNode;
  /**
   * Rendering of the counter shown to the right of the label.
   * Defaults to `value / max`.
   */
  formatValue?: (value: number, max: number) => React.ReactNode;
  /**
   * Color switching thresholds, as percentages.
   * Defaults to amber at 75%, red at 90%.
   */
  thresholds?: { warning: number; danger: number };
}

const defaultThresholds = { warning: 75, danger: 90 };

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max,
      label,
      ariaLabel,
      icon,
      helperText,
      action,
      formatValue,
      thresholds = defaultThresholds,
      className,
      ...props
    },
    ref
  ) => {
    const percentage =
      max > 0 ? Math.min(Math.max(Math.round((value / max) * 100), 0), 100) : 0;

    const progressColor =
      percentage >= thresholds.danger
        ? 'bg-rose-500'
        : percentage >= thresholds.warning
          ? 'bg-amber-500'
          : 'bg-brand-600';

    const counter = formatValue ? (
      formatValue(value, max)
    ) : (
      <>
        <strong className="font-bold text-slate-800">{value}</strong> / {max}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn('rounded-xl border border-slate-200/80 bg-slate-50 p-4', className)}
        {...props}
      >
        {(label || icon || formatValue) && (
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              {icon && (
                <span className="flex shrink-0 items-center" aria-hidden="true">
                  {icon}
                </span>
              )}
              {label && (
                <span className="truncate text-xs font-semibold text-slate-700">{label}</span>
              )}
            </div>
            <span className={cn('shrink-0 text-xs font-medium', mutedTextClass)}>{counter}</span>
          </div>
        )}

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max > 0 ? max : 0}
          aria-valuenow={value}
          aria-valuetext={`${percentage}%`}
          aria-label={ariaLabel ?? label}
          className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out motion-reduce:transition-none',
              progressColor
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {(helperText || action) && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/60 pt-2">
            {helperText ? (
              <span className={cn('text-xs', mutedTextClass)}>{helperText}</span>
            ) : (
              <span />
            )}
            {action}
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
