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

/*
  Heights are fixed rather than derived from padding: the thumb is absolutely
  positioned inside the track, so the track has to know how tall it is without
  asking its children.
*/
const sizes = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3.5 text-xs',
} as const;

/**
 * Group of exclusive segments, implementing the WAI-ARIA radio group pattern:
 * a single segment sits in the tab order (roving tabindex), arrow keys move the
 * selection, `Home` and `End` jump to either end.
 *
 * Visually it is one track with one indicator that slides between positions —
 * the selection is carried by fill and contrast, not by per-segment borders or
 * an underline. There is exactly one moving part, which is the point: a control
 * where every segment restyles itself reads as a row of buttons that happen to
 * agree.
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
      The selected index drives one sliding indicator rather than each segment
      styling itself. Segments are equal width (`flex-1 basis-0`), which is what
      lets the thumb be positioned arithmetically — one segment wide, translated
      by whole multiples of itself — with no measurement, no ResizeObserver and
      nothing to go stale when a label is translated.

      A negative index (a `value` that matches no option) simply hides the
      thumb, rather than parking it under the first segment and lying.
    */
    const selectedIndex = options.findIndex((option) => option.value === value);

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        /*
          One light track. Not a row of pills: there are no per-segment borders
          and no per-segment fills anywhere below — the only filled thing in the
          control is the single indicator that slides.
        */
        className={cn(
          'relative inline-flex w-full max-w-md rounded-xl bg-ink-100 p-1 dark:bg-ink-800',
          className
        )}
        {...props}
      >
        {/*
          The indicator is presentational and nothing else: `aria-hidden`, no
          role, no name. The radio group's own `aria-checked` is what announces
          the selection, and it would be announced identically if this element
          were deleted.

          It slides on the system's one easing curve. Under
          `prefers-reduced-motion` the transition is dropped and it simply
          appears in the new place — the position is information, the travel is
          not.
        */}
        {selectedIndex >= 0 && (
          <span
            aria-hidden="true"
            className={cn(
              /*
                Dark mode steps the fill up to `-400`, exactly as `Button`
                primary does: `brand-500` under near-black type measured 3.61:1
                on the dark replay of the suite, and the same inversion fixes
                both controls.
              */
              'pointer-events-none absolute inset-y-1 left-1 rounded-lg bg-brand-600 shadow-xs dark:bg-brand-400',
              'transition-transform duration-150 ease-settle motion-reduce:transition-none'
            )}
            /*
              An absolutely positioned box resolves a percentage width against
              its containing block's *padding* box, so the track's own 0.5rem of
              padding has to come out before the division. The thumb then
              measures exactly one segment, and translating it by whole
              multiples of its own width lands it precisely on each one.
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
                  `flex-1 basis-0` makes every segment the same width, which is
                  what the thumb arithmetic above depends on and what stops the
                  control reflowing when a locale lengthens one label.
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
