/** Text color classes for ATS scores on white backgrounds (WCAG AA 4.5:1). */
export function getScoreTextClass(score: number): string {
  if (score >= 75) return 'text-emerald-700';
  if (score >= 50) return 'text-amber-700';
  return 'text-rose-700';
}
