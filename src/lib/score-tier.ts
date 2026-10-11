/*
  Score tiers. The thresholds are exported so ScoreGauge draws its ticks at the
  same values that select the colour. ProgressBar uses its own thresholds.
*/

/** Lower bound (inclusive) of the `high` tier. */
export const SCORE_TIER_HIGH = 75;

/** Lower bound (inclusive) of the `medium` tier. */
export const SCORE_TIER_MEDIUM = 50;

export type ScoreTier = 'high' | 'medium' | 'low';

/** Maps a score onto its tier. */
export function getScoreTier(score: number): ScoreTier {
  if (score >= SCORE_TIER_HIGH) return 'high';
  if (score >= SCORE_TIER_MEDIUM) return 'medium';
  return 'low';
}

/** Text colour class for each tier, readable on light and dark surfaces (WCAG AA 4.5:1). */
export function getScoreTextClass(score: number): string {
  switch (getScoreTier(score)) {
    case 'high':
      return 'text-moss-700 dark:text-moss-300';
    case 'medium':
      return 'text-ochre-700 dark:text-ochre-300';
    case 'low':
      return 'text-brick-700 dark:text-brick-300';
  }
}
