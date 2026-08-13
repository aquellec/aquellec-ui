import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRingGhost } from '../../lib/focus-ring';

export interface UsageBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of credits or units already consumed. */
  current: number;
  /** Maximum quota for the current billing period. */
  max: number;
  /** Label describing what is being measured. */
  label?: string;
  /** Unit suffix displayed next to the numeric quota. */
  unit?: string;
  /** Shows the upgrade CTA row below the progress bar. */
  showUpgradeButton?: boolean;
  /** Handler invoked when the upgrade link is activated. */
  onUpgradeClick?: () => void;
}

export const UsageBar = React.forwardRef<HTMLDivElement, UsageBarProps>(
  (
    {
      current,
      max,
      label = 'Crédits consommés',
      unit = 'analyses',
      showUpgradeButton = true,
      onUpgradeClick,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max(Math.round((current / max) * 100), 0), 100);

    const progressColor =
      percentage >= 90 ? 'bg-rose-500' : percentage >= 75 ? 'bg-amber-500' : 'bg-brand-600';

    return (
      <div
        ref={ref}
        className={cn('p-4 bg-slate-50 border border-slate-200/80 rounded-xl', className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-brand-600 fill-brand-600/20" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-700">{label}</span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            <strong className="text-slate-800 font-bold">{current}</strong> / {max} {unit}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          aria-label={`${label} : ${percentage}% utilisé`}
          className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
        >
          <div
            className={cn('h-full transition-all duration-500 ease-out rounded-full', progressColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {showUpgradeButton && (
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
            <span className="text-[11px] text-slate-500">
              {percentage >= 90 ? 'Quota presque atteint' : 'Plan Gratuit'}
            </span>
            <button
              type="button"
              onClick={onUpgradeClick}
              className={cn(
                'text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors',
                focusRingGhost
              )}
            >
              Passer à la version Pro &rarr;
            </button>
          </div>
        )}
      </div>
    );
  }
);

UsageBar.displayName = 'UsageBar';
