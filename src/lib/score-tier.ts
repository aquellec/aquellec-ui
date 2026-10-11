/*
  ATS score tiers.

  The two thresholds are exported rather than buried in the branches: ScoreGauge
  draws its threshold ticks at these exact values, and a tick that disagrees
  with the colour it sits next to would be worse than no tick at all.

  ProgressBar does not use them: it measures quotas, with its own thresholds
  (75% and 90% by default).
*/

/** Score at or above which a profile reads as a match. */
export const SCORE_TIER_HIGH = 75;

/** Score at or above which a profile is worth reviewing by hand. */
export const SCORE_TIER_MEDIUM = 50;

export type ScoreTier = 'high' | 'medium' | 'low';

/** Maps an ATS score onto the three documented tiers. */
export function getScoreTier(score: number): ScoreTier {
  if (score >= SCORE_TIER_HIGH) return 'high';
  if (score >= SCORE_TIER_MEDIUM) return 'medium';
  return 'low';
}

/** Text colour classes for ATS scores, readable on light and dark surfaces (WCAG AA 4.5:1). */
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
