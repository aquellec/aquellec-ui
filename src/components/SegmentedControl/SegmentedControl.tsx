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
   * Accessible name of the group. Required unless `aria-labelledby` is
   * provided: an unnamed `radiogroup` is not usable with a screen reader.
   */
  ariaLabel?: string;
  /** Segment size. */
  size?: 'sm' | 'md';
}

/*
  Fixed heights: the thumb is absolutely positioned, so the track height must
  not depend on its children.
*/
const sizes = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3.5 text-xs',
} as const;

/**
 * Group of exclusive segments implementing the WAI-ARIA radio group pattern:
 * one segment in the tab order (roving tabindex), arrow keys move the
 * selection, `Home` and `End` jump to either end. A single sliding indicator
 * shows the selection.
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

    /*
      Segments are equal width (`flex-1 basis-0`), so the thumb is positioned
      arithmetically, without measuring the DOM or a ResizeObserver.

      A `value` that matches no option yields a negative index and hides the
      thumb.
    */
    const selectedIndex = options.findIndex((option) => option.value === value);

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        /* Single track; the indicator is the only filled element. */
        className={cn(
          'relative inline-flex w-full max-w-md rounded-xl bg-ink-100 p-1 dark:bg-ink-800',
          className
        )}
        {...props}
      >
        {/*
           Presentational only (`aria-hidden`): the selection is announced
           through `aria-checked`. The transition is removed under `prefers-
           reduced-motion`.
         */}
        {selectedIndex >= 0 && (
          <span
            aria-hidden="true"
            className={cn(
              /*
                `-400` in dark mode, as in Button `primary`: `brand-500` under
                near-black text measures 3.61:1.
              */
              'pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-brand-600 shadow-xs dark:bg-brand-400',
              'transition-transform duration-150 ease-settle motion-reduce:transition-none'
            )}
            /*
              A percentage width on an absolutely positioned box resolves
              against the containing block's padding box, so the track's 0.5rem
              padding is subtracted before dividing.
            */
            style={{
              width: `calc((100% - 0.5rem) / ${options.length})`,
              transform: `translateX(${selectedIndex * 100}%)`,
            }}
          />
        )}

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
                  `flex-1 basis-0` gives every segment the same width, which the
                  thumb position relies on.
                */
                'relative z-10 flex flex-1 basis-0 items-center justify-center gap-2 rounded-lg font-semibold',
                'transition-colors duration-150 ease-settle motion-reduce:transition-none',
                sizes[size],
                focusRing,
                isSelected
                  ? 'text-white dark:text-ink-950'
                  : cn(subtleTextClass, 'hover:text-ink-900 dark:hover:text-ink-50')
              )}
            >
              {option.icon && (
                <span className="flex shrink-0 items-center" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              <span className="truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
