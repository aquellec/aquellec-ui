import React from 'react';
import { cn } from '../../lib/cn';

/** Status wording shown under the gauge, based on the tier reached. */
export interface ScoreGaugeStatusLabels {
  /** Score >= 75. */
  high: string;
  /** Score >= 50. */
  medium: string;
  /** Score below 50. */
  low: string;
  /** Used instead of the tiers when `isAiTheme` is on. */
  ai: string;
}

/** English defaults. Pass `statusLabels` to render the gauge in another language. */
export const defaultScoreGaugeStatusLabels: ScoreGaugeStatusLabels = {
  high: 'Excellent match',
  medium: 'Average match',
  low: 'Needs work',
  ai: 'AI analysis',
};

export interface ScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Partial override of the status wording, merged over the defaults. */
  statusLabels?: Partial<ScoreGaugeStatusLabels>;
  /** ATS compatibility score between 0 and 100. */
  score: number;
  /** Diameter preset for the circular gauge. */
  size?: 'sm' | 'md' | 'lg';
  /** Label shown below the percentage value. */
  label?: string;
  /** Displays the semantic status badge under the gauge. */
  showStatus?: boolean;
  /** Applies the purple AI theme regardless of score thresholds. */
  isAiTheme?: boolean;
}

export const ScoreGauge = React.forwardRef<HTMLDivElement, ScoreGaugeProps>(
  (
    {
      score,
      size = 'md',
      label,
      statusLabels: statusLabelsProp,
      showStatus = true,
      isAiTheme = false,
      className,
      ...props
    },
    ref
  ) => {
    const normalizedScore = Math.min(Math.max(score, 0), 100);
    const statusLabels: ScoreGaugeStatusLabels = {
      ...defaultScoreGaugeStatusLabels,
      ...statusLabelsProp,
    };

    const dimensions = {
      sm: { width: 100, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-[10px]' },
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
          stroke: 'stroke-ai-500 dark:stroke-ai-400',
          text: 'text-ai-700 dark:text-ai-300',
          bg: 'bg-ai-50 text-ai-700 border-ai-200 dark:bg-ai-500/15 dark:text-ai-300 dark:border-ai-500/30',
          statusText: statusLabels.ai,
        };
      }

      if (normalizedScore >= 75) {
        return {
          stroke: 'stroke-emerald-500 dark:stroke-emerald-400',
          text: 'text-emerald-700 dark:text-emerald-300',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
          statusText: statusLabels.high,
        };
      }
      if (normalizedScore >= 50) {
        return {
          stroke: 'stroke-amber-500 dark:stroke-amber-400',
          text: 'text-amber-700 dark:text-amber-300',
          bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
          statusText: statusLabels.medium,
        };
      }
      return {
        stroke: 'stroke-rose-500 dark:stroke-rose-400',
        text: 'text-rose-700 dark:text-rose-300',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30',
        statusText: statusLabels.low,
      };
    };

    const colors = getScoreColor();
    // `aria-valuetext`: punctuation is language agnostic here, only the variable
    // parts come from props.
    const gaugeLabel = label
      ? `${label} — ${normalizedScore}%. ${colors.statusText}.`
      : `${normalizedScore}%. ${colors.statusText}.`;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-neutral-100 shadow-xs',
          'dark:bg-neutral-900 dark:border-neutral-700',
          className
        )}
        {...props}
      >
        <div className="relative inline-flex items-center justify-center">
          <svg
            width={width}
            height={width}
            className="transform -rotate-90"
            role="meter"
            aria-valuenow={normalizedScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={gaugeLabel}
            aria-label={label}
          >
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              className="stroke-neutral-100 dark:stroke-neutral-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              className={cn('transition-all duration-1000 ease-out', colors.stroke)}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none"
            aria-hidden="true"
          >
            <span className={cn('font-bold leading-tight tracking-tight', fontSize, colors.text)}>
              {normalizedScore}%
            </span>
            {label && (
              <span
                className={cn(
                  'font-medium text-neutral-500 dark:text-neutral-400 leading-none mt-0.5 max-w-[80%] line-clamp-2',
                  labelSize
                )}
              >
                {label}
              </span>
            )}
          </div>
        </div>

        {showStatus && (
          <div className={cn('mt-3 px-3 py-1 rounded-full text-xs font-semibold border', colors.bg)}>
            {colors.statusText}
          </div>
        )}
      </div>
    );
  }
);

ScoreGauge.displayName = 'ScoreGauge';
