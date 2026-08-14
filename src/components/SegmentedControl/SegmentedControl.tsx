import React, { useRef } from 'react';
import { cn } from '../../lib/cn';
import { subtleTextClass } from '../../lib/semantic-colors';
import { focusRing } from '../../lib/focus-ring';

export interface SegmentedControlOption {
  /** Valeur remontée par `onChange` lorsque l'option est sélectionnée. */
  value: string;
  /** Libellé visible, également utilisé comme nom accessible de l'option. */
  label: string;
  /** Illustration optionnelle placée avant le libellé. Rendue décorative. */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Options affichées, dans l'ordre. */
  options: SegmentedControlOption[];
  /** Valeur sélectionnée. Le composant est contrôlé. */
  value: string;
  /** Appelé avec la valeur de l'option choisie. */
  onChange: (value: string) => void;
  /**
   * Nom accessible du groupe. Requis si aucun `aria-labelledby` n'est fourni :
   * un `radiogroup` sans nom n'est pas exploitable au lecteur d'écran.
   */
  ariaLabel?: string;
  /** Taille des segments. */
  size?: 'sm' | 'md';
}

const sizes = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-xs',
} as const;

/**
 * Groupe de segments exclusifs, implémenté selon le pattern WAI-ARIA « radio
 * group » : un seul segment est dans l'ordre de tabulation (roving tabindex),
 * les flèches déplacent la sélection, `Home` et `End` vont aux extrémités.
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
      // Le focus suit la sélection : la liste est re-rendue avec le nouveau
      // roving tabindex, d'où le report à la frame suivante.
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
                'flex items-center gap-2 rounded-lg font-semibold transition-all duration-200',
                'motion-reduce:transition-none',
                sizes[size],
                focusRing,
                isSelected
                  ? 'bg-white text-slate-800 shadow-sm'
                  : cn(subtleTextClass, 'hover:text-slate-700')
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
