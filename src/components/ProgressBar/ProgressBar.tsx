import React from 'react';
import { cn } from '../../lib/cn';
import { dataFigureClass, thresholdMarkClass } from '../../lib/mark';
import { dividerBorderClass, mutedTextClass, sunkenSurfaceClass } from '../../lib/semantic-colors';

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

    /*
      The `-600` step in light rather than the customary `-500`: measured
      against the `ink-200` rail, only `-600` clears the 3:1 WCAG 1.4.11 asks of
      a graphic that carries meaning. Ochre is the one that exposed it — at
      `-500` it sat at 2.83:1 and looked fine to anyone who did not measure.
    */
    const progressColor =
      percentage >= thresholds.danger
        ? 'bg-brick-600 dark:bg-brick-400'
        : percentage >= thresholds.warning
          ? 'bg-ochre-600 dark:bg-ochre-400'
          : 'bg-brand-600 dark:bg-brand-400';

    /*
      The threshold form of the mark, on a straight rail: the two points where
      this bar changes what it means. A quota bar that turns amber with no
      indication of where amber began asks the reader to guess; these say it.
      Only thresholds that fall inside the rail are drawn.
    */
    const markedThresholds = [thresholds.warning, thresholds.danger].filter(
      (threshold) => threshold > 0 && threshold < 100
    );

    const counter = formatValue ? (
      formatValue(value, max)
    ) : (
      <>
        <strong className="font-semibold text-ink-900 dark:text-ink-50">{value}</strong> / {max}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn('rounded-xl p-4', sunkenSurfaceClass, className)}
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
                <span className="truncate text-xs font-semibold uppercase tracking-eyebrow text-ink-800 dark:text-ink-100">
                  {label}
                </span>
              )}
            </div>
            <span className={cn('shrink-0 text-xs font-medium', dataFigureClass, mutedTextClass)}>
              {counter}
            </span>
          </div>
        )}

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max > 0 ? max : 0}
          aria-valuenow={value}
          aria-valuetext={`${percentage}%`}
          aria-label={ariaLabel ?? label}
          className="relative h-3 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800"
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-settle motion-reduce:transition-none',
              progressColor
            )}
            style={{ width: `${percentage}%` }}
          />
          {markedThresholds.map((threshold) => (
            <span
              key={threshold}
              aria-hidden="true"
              className={thresholdMarkClass}
              style={{ left: `${threshold}%` }}
            />
          ))}
        </div>

        {(helperText || action) && (
          <div
            className={cn(
              'mt-3 flex items-center justify-between gap-3 border-t pt-2.5',
              dividerBorderClass
            )}
          >
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
