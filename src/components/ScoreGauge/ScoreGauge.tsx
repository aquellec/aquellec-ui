import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showStatus?: boolean;
  isAiTheme?: boolean;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  label = 'Score ATS',
  showStatus = true,
  isAiTheme = false,
  className,
}) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  const dimensions = {
    sm: { width: 100, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { width: 140, strokeWidth: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { width: 180, strokeWidth: 12, fontSize: 'text-4xl', labelSize: 'text-base' },
  };

  const { width, strokeWidth, fontSize, labelSize } = dimensions[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getScoreColor = () => {
    if (isAiTheme) {
      return {
        stroke: 'stroke-ai-500',
        text: 'text-ai-600',
        bg: 'bg-ai-50 text-ai-700 border-ai-200',
        statusText: 'Analyse IA',
      };
    }

    if (normalizedScore >= 75) {
      return {
        stroke: 'stroke-emerald-500',
        text: 'text-emerald-600',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        statusText: 'Excellent Match',
      };
    }
    if (normalizedScore >= 50) {
      return {
        stroke: 'stroke-amber-500',
        text: 'text-amber-600',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        statusText: 'Compatibilité Moyenne',
      };
    }
    return {
      stroke: 'stroke-rose-500',
      text: 'text-rose-600',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      statusText: 'Optimisation Nécessaire',
    };
  };

  const colors = getScoreColor();

  return (
    <div className={twMerge('flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm', className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg width={width} height={width} className="transform -rotate-90">
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            className={clsx('transition-all duration-1000 ease-out', colors.stroke)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={clsx('font-bold leading-none tracking-tight', fontSize, colors.text)}>
            {normalizedScore}%
          </span>
          {label && (
            <span className={clsx('font-medium text-slate-400 mt-1', labelSize)}>
              {label}
            </span>
          )}
        </div>
      </div>

      {showStatus && (
        <div className={clsx('mt-3 px-3 py-1 rounded-full text-xs font-semibold border', colors.bg)}>
          {colors.statusText}
        </div>
      )}
    </div>
  );
};
