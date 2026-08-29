import React, { useRef } from 'react';
import { cn } from '../../lib/cn';
import { subtleTextClass } from '../../lib/semantic-colors';
import { focusRing } from '../../lib/focus-ring';

export interface SegmentedControlOption {
  /** Value reported by `onChange` when the option is selected. */
  value: string;
  /** Visible label, also used as the accessible name of the option. */
  label: string;
  /** Optional illustration placed before the label. Rendered as decorative. */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Options rendered, in order. */
  options: SegmentedControlOption[];
  /** Selected value. The component is controlled. */
  value: string;
  /** Called with the value of the chosen option. */
  onChange: (value: string) => void;
  /**
   * Accessible name of the group. Required unless an `aria-labelledby` is
   * provided: an unnamed `radiogroup` is unusable with a screen reader.
   */
  ariaLabel?: string;
  /** Segment size. */
  size?: 'sm' | 'md';
}

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-xs',
} as const;

/**
 * Group of exclusive segments, implementing the WAI-ARIA radio group pattern:
 * a single segment sits in the tab order (roving tabindex), arrow keys move the
 * selection, `Home` and `End` jump to either end.
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    { options, value, onChange, ariaLabel, size = 'md', className, onKeyDown, ...props },
    ref
  ) => {
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const selectAt = (index: number) => {
      const option = options[index];
      if (!option) return;
      onChange(option.value);
      // Focus follows selection: the list re-renders with the new roving
      // tabindex, hence deferring to the next frame.
      requestAnimationFrame(() => optionRefs.current[index]?.focus());
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = options.findIndex((option) => option.value === value);
      const count = options.length;

      if (count > 0) {
        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            selectAt((currentIndex + 1) % count);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            selectAt((currentIndex - 1 + count) % count);
            break;
          case 'Home':
            event.preventDefault();
            selectAt(0);
            break;
          case 'End':
            event.preventDefault();
            selectAt(count - 1);
            break;
        }
      }

      onKeyDown?.(event);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex rounded-xl border border-slate-200/60 bg-slate-100 p-1',
          'dark:border-slate-700 dark:bg-slate-800',
          className
        )}
        {...props}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(option.value)}
              className={cn(
                /*
                  `grow` + `justify-center`: the root is `inline-flex`, so it
                  shrink-wraps and these have no effect in normal use. But a
                  flex item is blockified — dropped into a `flex-col` header the
                  control stretches to the full width, and without this the
                  segments stay on the left with dead space beside them.
                */
                'flex grow items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
                'motion-reduce:transition-none',
                sizes[size],
                focusRing,
                isSelected
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                  : cn(subtleTextClass, 'hover:text-slate-700 dark:hover:text-slate-100')
              )}
            >
              {option.icon && (
                <span className="flex shrink-0 items-center" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
