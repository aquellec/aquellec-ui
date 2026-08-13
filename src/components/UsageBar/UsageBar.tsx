import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Zap } from 'lucide-react';

export interface UsageBarProps {
  current: number;
  max: number;
  label?: string;
  unit?: string;
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
  className?: string;
}

export const UsageBar: React.FC<UsageBarProps> = ({
  current,
  max,
  label = 'Crédits consommés',
  unit = 'analyses',
  showUpgradeButton = true,
  onUpgradeClick,
  className,
}) => {
  const percentage = Math.min(Math.max(Math.round((current / max) * 100), 0), 100);

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-rose-500';
    if (percentage >= 75) return 'bg-amber-500';
    return 'bg-brand-600';
  };

  return (
    <div className={twMerge('p-4 bg-slate-50 border border-slate-200/80 rounded-xl', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-brand-600 fill-brand-600/20" />
          <span className="text-xs font-semibold text-slate-700">{label}</span>
        </div>
        <span className="text-xs font-medium text-slate-500">
          <strong className="text-slate-800 font-bold">{current}</strong> / {max} {unit}
        </span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-500 ease-out rounded-full', getProgressColor())}
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
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Passer à la version Pro &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
