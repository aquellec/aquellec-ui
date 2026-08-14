import React from 'react';
import { cn } from '../../lib/cn';
import { mutedTextClass } from '../../lib/semantic-colors';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valeur courante, exprimée dans la même unité que `max`. */
  value: number;
  /** Valeur maximale. Une valeur nulle ou négative affiche une barre vide. */
  max: number;
  /** Libellé visible décrivant ce qui est mesuré. Sert aussi de nom accessible. */
  label?: string;
  /**
   * Nom accessible de la barre quand aucun `label` visible n'est rendu.
   * Une `progressbar` sans nom est une violation axe (`aria-progressbar-name`).
   */
  ariaLabel?: string;
  /** Illustration optionnelle placée avant le libellé. Rendue décorative. */
  icon?: React.ReactNode;
  /** Texte secondaire sous la barre (contexte, palier, rappel de plan). */
  helperText?: React.ReactNode;
  /** Élément d'action aligné à droite du `helperText` (lien, bouton). */
  action?: React.ReactNode;
  /**
   * Rendu du compteur affiché à droite du libellé.
   * Par défaut : `value / max`.
   */
  formatValue?: (value: number, max: number) => React.ReactNode;
  /**
   * Seuils de bascule de couleur, en pourcentage.
   * Par défaut : ambre à 75 %, rouge à 90 %.
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
