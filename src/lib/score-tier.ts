/*
  ATS score tiers.

  The two thresholds are exported rather than buried in the branches: ScoreGauge
  and ProgressBar both draw the threshold form of the mark at these exact
  values, and a tick that disagrees with the colour it sits next to would be
  worse than no tick at all.
*/

/** Score at or above which a profile reads as a match. */
export const SCORE_TIER_HIGH = 75;

/** Score at or above which a profile is worth reviewing by hand. */
export const SCORE_TIER_MEDIUM = 50;

/** Text colour classes for ATS scores, readable on light and dark surfaces (WCAG AA 4.5:1). */
export function getScoreTextClass(score: number): string {
  if (score >= SCORE_TIER_HIGH) return 'text-moss-700 dark:text-moss-300';
  if (score >= SCORE_TIER_MEDIUM) return 'text-ochre-700 dark:text-ochre-300';
  return 'text-brick-700 dark:text-brick-300';
}
