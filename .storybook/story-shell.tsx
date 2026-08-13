import type { Decorator } from '@storybook/react-vite';

/** Provides a visually hidden page title so section headings keep a valid order in Storybook. */
export function withPageTitle(pageTitle: string, sectionLevel: 'h1' | 'h2' = 'h1'): Decorator {
  const SectionTag = sectionLevel;

  return (Story) => (
    <>
      <SectionTag className="sr-only">{pageTitle}</SectionTag>
      <Story />
    </>
  );
}
