/** Text color classes for ATS scores, readable on light and dark surfaces (WCAG AA 4.5:1). */
export function getScoreTextClass(score: number): string {
  if (score >= 75) return 'text-emerald-700 dark:text-emerald-300';
  if (score >= 50) return 'text-amber-700 dark:text-amber-300';
  return 'text-rose-700 dark:text-rose-300';
}
