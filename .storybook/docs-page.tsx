import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
  useOf,
} from '@storybook/addon-docs/blocks';
import { useI18n } from './i18n';

/**
 * Autodocs template with a localized component description.
 *
 * Storybook builds the default page from the JSDoc block above each `meta`,
 * which is source code and therefore English only. The description is looked up
 * in the dictionary by story title instead, so it follows the toolbar locale,
 * and falls back to the JSDoc block when no entry exists.
 *
 * What stays English on these pages, and cannot reasonably change: example
 * headings are story export names — translating them would change story ids and
 * break every deep link — and the props table headers, `Show code` and `Copy
 * code` belong to Storybook's own interface.
 */
export function LocalizedDocsPage() {
  const descriptions = useI18n().docs.components;
  const resolved = useOf('meta');
  const title = 'preparedMeta' in resolved ? resolved.preparedMeta.title : undefined;
  const description = title
    ? (descriptions as Record<string, string | undefined>)[title]
    : undefined;

  return (
    <>
      <Title />
      <Subtitle />
      {description ? (
        <p className="sb-unstyled mb-6 max-w-3xl text-base leading-relaxed text-slate-600">
          {description}
        </p>
      ) : (
        <Description of="meta" />
      )}
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}
