import type React from 'react';

export type SectionHeadingElement = 'h2' | 'h3' | 'div';

/** Picks a semantic heading level without skipping when nested under a page title. */
export function resolveSectionHeading(
  title: React.ReactNode,
  titleAs?: SectionHeadingElement,
  defaultLevel: SectionHeadingElement = 'h2'
): SectionHeadingElement {
  if (titleAs) return titleAs;
  if (typeof title === 'string' || typeof title === 'number') return defaultLevel;
  return 'div';
}
