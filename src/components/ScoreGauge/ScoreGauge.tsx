import React from 'react';
import { cn } from '../../lib/cn';
import { dataFigureClass, thresholdStrokeClass } from '../../lib/mark';
import { getScoreTier, SCORE_TIER_HIGH, SCORE_TIER_MEDIUM } from '../../lib/score-tier';
import { mutedTextClass, raisedSurfaceClass } from '../../lib/semantic-colors';

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
  /** Score between 0 and 100. */
  score: number;
  /** Diameter preset for the circular gauge. */
  size?: 'sm' | 'md' | 'lg';
  /** Label shown below the percentage value. */
  label?: string;
  /** Displays the semantic status badge under the gauge. */
  showStatus?: boolean;
  /** Applies the AI accent regardless of score thresholds. */
  isAiTheme?: boolean;
}

/**
 * Threshold ticks on the circular track, one per tier boundary.
 *
 * The dash starts at three o'clock and runs clockwise, so a tick for fraction
 * `f` sits at `2πf` from the positive x-axis. The SVG is then rotated a quarter
 * turn, which carries the ticks with it; computing them in the rotated frame
 * would apply the rotation twice.
 */
function ThresholdTicks({
  center,
  radius,
  strokeWidth,
  fractions,
}: {
  center: number;
  radius: number;
  strokeWidth: number;
  fractions: number[];
}) {
  const inner = radius - strokeWidth / 2;
  const outer = radius + strokeWidth / 2;

  return (
    <>
      {fractions.map((fraction) => {
        const angle = 2 * Math.PI * fraction;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return (
          <line
            key={fraction}
            x1={center + inner * cos}
            y1={center + inner * sin}
            x2={center + outer * cos}
            y2={center + outer * sin}
            strokeWidth={2}
            className={thresholdStrokeClass}
          />
        );
      })}
    </>
  );
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

    /*
      Numeral size per preset. The ring stroke grows with the diameter to keep
      the same proportion to the numeral.
    */
    const dimensions = {
      sm: { width: 104, strokeWidth: 10, fontSize: 'text-2xl', labelSize: 'text-[10px]' },
      md: { width: 152, strokeWidth: 14, fontSize: 'text-4xl', labelSize: 'text-sm' },
      lg: { width: 200, strokeWidth: 18, fontSize: 'text-5xl', labelSize: 'text-base' },
    };

    const { width, strokeWidth, fontSize, labelSize } = dimensions[size];
    const radius = (width - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

    /*
      Arc colours: `-600` in light and `-400` in dark both clear 3:1 against
      their track (WCAG 1.4.11); ochre `-500` does not on `ink-200`.
    */
    const getScoreColor = () => {
      if (isAiTheme) {
        /* The AI theme is not a tier, so it uses the brand hue rather than a status colour. */
        return {
          stroke: 'stroke-brand-600 dark:stroke-brand-400',
          text: 'text-brand-700 dark:text-brand-300',
          tag: 'bg-brand-100 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
          statusText: statusLabels.ai,
        };
      }

      switch (getScoreTier(normalizedScore)) {
        case 'high':
          return {
            stroke: 'stroke-moss-600 dark:stroke-moss-400',
            text: 'text-moss-700 dark:text-moss-300',
            tag: 'bg-moss-100 text-moss-900 dark:bg-moss-500/20 dark:text-moss-100',
            statusText: statusLabels.high,
          };
        case 'medium':
          return {
            stroke: 'stroke-ochre-600 dark:stroke-ochre-400',
            text: 'text-ochre-700 dark:text-ochre-300',
            tag: 'bg-ochre-100 text-ochre-900 dark:bg-ochre-500/20 dark:text-ochre-100',
            statusText: statusLabels.medium,
          };
        case 'low':
          return {
            stroke: 'stroke-brick-600 dark:stroke-brick-400',
            text: 'text-brick-700 dark:text-brick-300',
            tag: 'bg-brick-100 text-brick-900 dark:bg-brick-500/20 dark:text-brick-100',
            statusText: statusLabels.low,
          };
      }
    };

    const colors = getScoreColor();
    // `aria-valuetext`: punctuation is language-agnostic; only the variable
    // parts come from props.
    const gaugeLabel = label
      ? `${label} — ${normalizedScore}%. ${colors.statusText}.`
      : `${normalizedScore}%. ${colors.statusText}.`;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl p-5 shadow-card',
          raisedSurfaceClass,
          className
        )}
        {...props}
      >
        <div className="relative inline-flex items-center justify-center">
          <svg
            width={width}
            height={width}
            className="-rotate-90 transform"
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
              className="stroke-ink-200 dark:stroke-ink-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              className={cn(
                'transition-all duration-700 ease-settle motion-reduce:transition-none',
                colors.stroke
              )}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
            {/*
               Drawn last so the ticks stay visible over the filled arc,
               including at 100%. Not drawn under the AI theme, which has no
               tiers.
             */}
            {!isAiTheme && (
              <ThresholdTicks
                center={width / 2}
                radius={radius}
                strokeWidth={strokeWidth}
                fractions={[SCORE_TIER_MEDIUM / 100, SCORE_TIER_HIGH / 100]}
              />
            )}
          </svg>

          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-2 text-center"
            aria-hidden="true"
          >
            <span
              className={cn(
                'aq-display font-display font-bold leading-none tracking-masthead',
                dataFigureClass,
                fontSize,
                colors.text
              )}
            >
              {normalizedScore}%
            </span>
            {label && (
              <span
                className={cn(
                  'mt-0.5 line-clamp-2 max-w-[80%] font-medium leading-none',
                  mutedTextClass,
                  labelSize
                )}
              >
                {label}
              </span>
            )}
          </div>
        </div>

        {/* Status tag for the current tier. */}
        {showStatus && (
          <div
            className={cn(
              'mt-4 inline-flex h-6 items-center rounded-md px-2.5 text-xs font-semibold uppercase tracking-wide',
              colors.tag
            )}
          >
            {colors.statusText}
          </div>
        )}
      </div>
    );
  }
);

ScoreGauge.displayName = 'ScoreGauge';
