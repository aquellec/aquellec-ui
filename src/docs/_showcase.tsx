import React from 'react';
import {
  Accessibility,
  BarChart3,
  Bell,
  Code2,
  FileCode2,
  FileUp,
  FlaskConical,
  LayoutDashboard,
  LayoutGrid,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useI18n, type Dictionary } from '../../.storybook/i18n';
import { cn } from '../lib/cn';
import { aquellecColors } from '../lib/design-tokens';
import { focusRing } from '../lib/focus-ring';
import { ruleMarkClass } from '../lib/mark';
import {
  bodyTextClass,
  dividerBorderClass,
  mutedTextClass,
  raisedSurfaceClass,
  strongTextClass,
  subtleTextClass,
  surfaceBorderClass,
} from '../lib/semantic-colors';

/*
  Visual blocks of the Docs/Introduction page, also reused by Docs/Tokens
  (`_tokens.tsx`) so both pages share one visual language: same surfaces, same
  accents, same section headers.

  They live in a `.tsx` rather than as inline classes in the MDX so they can be
  shared and typed. The Tailwind glob now covers `.mdx` too
  (`tailwind.config.ts` -> content), so it is no longer a compilation
  constraint, but the convention stands: styling lives in components.

  Every block carries `sb-unstyled`. Storybook applies its documentation styles
  to every element of an MDX page (`.css-xxx :where(div:not(.sb-unstyled…))`,
  and likewise for p, ul, li, headings and tables) at the same specificity as
  Tailwind utilities — but injected afterwards, so they win. Without that
  marker, `text-xs` rendered at 16px and `font-mono` stayed in Inter.
  `sb-unstyled` is the official escape hatch, honoured by all of their rules.
*/

/** Accents derived exclusively from preset tokens (brand / ai / semantic). */
export type AccentName = 'brand' | 'ai' | 'info' | 'success' | 'warning';

interface Accent {
  /** Icon chip: tinted background plus ring. */
  tile: string;
  /** Top accent bar of the pillar cards. */
  bar: string;
  /** Card border on hover. */
  hover: string;
}

/**
 * Colours of the icon tiles, shared by both documentation pages.
 *
 * Every accent carries a ring on both sides of the theme. In light mode the
 * semantic `*-border` tokens are pastels that sit at the same weight as the
 * `brand` and `ai` rings; on a dark surface those same pastels stay opaque and
 * read as a hard outline, while a mid-tone hue at 20% disappears entirely —
 * which is why three tiles looked bordered and two did not. The dark ring is
 * therefore stated for all five at one opacity.
 *
 * The record is exported so `_tokens.tsx` composes the same strings instead of
 * repeating them: the drift above came from having two copies.
 */
export const accentTileClass: Record<AccentName, string> = {
  brand:
    'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/30',
  /* Neutral, not an accent: the `ai` family is ink in this system. */
  ai: 'bg-ink-100 text-ink-900 ring-1 ring-ink-900/15 dark:bg-ink-800 dark:text-ink-50 dark:ring-ink-100/20',
  info: 'bg-semantic-info-bg text-semantic-info-fg ring-1 ring-semantic-info-border dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-400/30',
  success:
    'bg-semantic-success-bg text-semantic-success-fg ring-1 ring-semantic-success-border dark:bg-moss-500/15 dark:text-moss-300 dark:ring-moss-400/30',
  warning:
    'bg-semantic-warning-bg text-semantic-warning-fg ring-1 ring-semantic-warning-border dark:bg-ochre-500/15 dark:text-ochre-300 dark:ring-ochre-400/30',
};

const accents: Record<AccentName, Accent> = {
  brand: {
    tile: accentTileClass.brand,
    bar: 'bg-brand-500',
    hover: 'hover:border-brand-500/40 dark:hover:border-brand-400/40',
  },
  ai: {
    tile: accentTileClass.ai,
    bar: 'bg-ink-300 dark:bg-ink-600',
    hover: 'hover:border-ink-400/60 dark:hover:border-ink-500/60',
  },
  info: {
    tile: accentTileClass.info,
    bar: 'bg-semantic-info-fg',
    hover: 'hover:border-semantic-info-fg/40 dark:hover:border-brand-400/40',
  },
  success: {
    tile: accentTileClass.success,
    bar: 'bg-semantic-success-fg',
    hover: 'hover:border-semantic-success-fg/40 dark:hover:border-moss-400/40',
  },
  warning: {
    tile: accentTileClass.warning,
    bar: 'bg-semantic-warning-fg',
    hover: 'hover:border-semantic-warning-fg/40 dark:hover:border-ochre-400/40',
  },
};

/** Shared card surface: consistent radius and elevation. */
export const cardSurface = cn(
  'rounded-xl border shadow-card',
  raisedSurfaceClass,
  surfaceBorderClass
);

/**
 * The display treatment, used by every heading that opens a page or a section.
 *
 * Fraunces with both decorative axes pinned off (`aq-display`, set in
 * `preview-head.html`) and tracking pulled in, because a serif at 48px with
 * default spacing reads as a word processor. This is the one place the system
 * allows itself a second typeface, and it is the reason the documentation does
 * not look like every other Storybook.
 */
export const displayClass = 'aq-display font-display font-semibold tracking-tight';

/** Wide-tracked uppercase kicker. The same treatment the DataTable gives a column head. */
export const eyebrowClass = 'text-xs font-semibold uppercase tracking-eyebrow';

/** Transitions neutralised when the user asks for reduced motion. */
export const softTransition =
  'transition-colors duration-150 ease-settle motion-reduce:transition-none';

const linkClass = cn(
  'rounded-[0.125rem] text-brand-700 underline decoration-brand-500/40 underline-offset-2 dark:text-brand-300',
  'hover:decoration-brand-500',
  softTransition,
  focusRing
);

/* -------------------------------------------------------------------------- */
/*  Section header: eyebrow + title                                            */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
  section,
  id,
}: {
  section: keyof Dictionary['docs']['sections'];
  id: string;
}) {
  const { kicker, title } = useI18n().docs.sections[section];

  return (
    <header className="sb-unstyled mb-6 mt-14 flex flex-col gap-2.5">
      {/* The rule form of the mark: 2px of brand, then the kicker. */}
      <p
        className={cn(
          'flex items-center gap-2.5 text-brand-700 dark:text-brand-300',
          eyebrowClass
        )}
      >
        <span className={ruleMarkClass} aria-hidden="true" />
        {kicker}
      </p>
      <h2
        id={id}
        className={cn('text-3xl md:text-4xl', displayClass, strongTextClass)}
      >
        {title}
      </h2>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page cover                                                                 */
/* -------------------------------------------------------------------------- */

/** One line of the colophon: a label and the fact it names. */
export interface CoverFact {
  label: string;
  value: string;
}

/**
 * The cover every documentation page opens on.
 *
 * Not a hero. A hero is a gradient with a slogan in it; this is a specimen
 * page — the thing a foundry prints to show what a face does. The left column
 * carries the name at display size, the right column a colophon of hard facts
 * set in mono, and the whole sheet wears the leading mark and is signed off by
 * the brand ramp printed as a continuous band along the foot.
 *
 * The asymmetry is the point. A centred cover has nothing to say about where
 * reading starts; this one puts the rule, the title and the mark on one left
 * edge and lets the facts hang off the right, where the eye finishes.
 */
export function PageCover({
  kicker,
  title,
  description,
  facts,
  ramp = 'brand',
}: {
  kicker: string;
  title: React.ReactNode;
  description: string;
  facts: readonly CoverFact[];
  ramp?: 'brand' | 'ai';
}) {
  const scale = Object.entries(aquellecColors[ramp]);

  return (
    <header
      className={cn(
        'sb-unstyled mb-14 overflow-hidden rounded-2xl border bg-ink-50 dark:bg-ink-900',
        surfaceBorderClass
      )}
    >
      <div className="grid gap-10 p-8 md:grid-cols-[minmax(0,1fr)_auto] md:p-10">
        <div className="flex flex-col items-start gap-4">
          <p
            className={cn(
              'flex items-center gap-2.5 text-brand-700 dark:text-brand-300',
              eyebrowClass
            )}
          >
            <span className={ruleMarkClass} aria-hidden="true" />
            {kicker}
          </p>

          <h1 className={cn('text-4xl md:text-6xl', displayClass, strongTextClass)}>{title}</h1>

          <p className={cn('max-w-measure text-base leading-relaxed', bodyTextClass)}>
            {description}
          </p>
        </div>

        {/*
          The colophon. `div` rather than `dl`: Storybook's documentation styles
          italicise `dt` and indent `dd`, which turns a ruled technical block
          into a quotation.
        */}
        <div className="flex min-w-[13rem] flex-col justify-end">
          <div className={cn('divide-y border-t', dividerBorderClass)}>
            {facts.map(({ label, value }) => (
              <div key={label} className="flex items-baseline justify-between gap-6 py-2">
                <span className={cn('text-xs', mutedTextClass)}>{label}</span>
                <span className={cn('font-mono text-xs font-semibold tabular-nums', strongTextClass)}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*
        The ramp, printed edge to edge as one continuous band — eleven steps
        with no gaps, so it reads as a single measured run of ink rather than
        eleven chips. Every cover in the documentation is signed by the palette
        it is written in.
      */}
      <div className="flex h-2" aria-hidden="true">
        {scale.map(([shade, hex]) => (
          <span key={shade} className="flex-1" style={{ backgroundColor: hex }} />
        ))}
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Introduction cover                                                         */
/* -------------------------------------------------------------------------- */

export function Hero() {
  const t = useI18n().docs.introduction;

  return (
    <PageCover
      kicker={t.heroKicker}
      title="aquellec/ui"
      description={t.heroDescription}
      facts={t.facts}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Pillars                                                                    */
/* -------------------------------------------------------------------------- */

type PillarKey = keyof Dictionary['docs']['introduction']['pillars'];

interface Pillar {
  key: PillarKey;
  icon: LucideIcon;
  accent: AccentName;
}

const pillars: Pillar[] = [
  { key: 'accessibility', icon: ShieldCheck, accent: 'brand' },
  { key: 'domain', icon: Sparkles, accent: 'ai' },
  { key: 'dx', icon: Code2, accent: 'info' },
];

export function Pillars() {
  const t = useI18n().docs.introduction.pillars;

  return (
    <div className="sb-unstyled mb-4 grid gap-4 md:grid-cols-3">
      {pillars.map(({ key, icon: Icon, accent }) => (
        <div key={key} className={cn(cardSurface, 'overflow-hidden')}>
          <div className={cn('h-1 w-full', accents[accent].bar)} aria-hidden="true" />
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  accents[accent].tile
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{t[key].title}</p>
            </div>
            <p className={cn('text-sm leading-relaxed', subtleTextClass)}>{t[key].body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Architecture: component families                                           */
/* -------------------------------------------------------------------------- */

type FamilyKey = keyof Dictionary['docs']['introduction']['families'];

interface Family {
  name: string;
  icon: LucideIcon;
  accent: AccentName;
  links: Array<{ label: string; href: string }>;
  key: FamilyKey;
}

/*
  Navigation links: Autodocs pages are named "Documentation"
  (.storybook/main.ts -> docs.defaultName), so their id is
  `<title-kebab>--documentation` and not `--docs`.
  MDX pages render inside the preview iframe, so every link uses a relative URL
  (`./?path=…`) plus `target="_top"` to drive the manager.
*/
const families: Family[] = [
  {
    name: 'Actions',
    icon: MousePointerClick,
    accent: 'brand',
    links: [
      { label: 'Button', href: './?path=/docs/actions-button--documentation' },
      { label: 'SegmentedControl', href: './?path=/docs/actions-segmentedcontrol--documentation' },
    ],
    key: 'actions',
  },
  {
    name: 'Forms',
    icon: FileUp,
    accent: 'info',
    links: [
      { label: 'Input', href: './?path=/docs/forms-input--documentation' },
      { label: 'Textarea', href: './?path=/docs/forms-textarea--documentation' },
      { label: 'Dropzone', href: './?path=/docs/forms-dropzone--documentation' },
    ],
    key: 'forms',
  },
  {
    name: 'Feedback',
    icon: Bell,
    accent: 'warning',
    links: [
      { label: 'Toast', href: './?path=/docs/feedback-toast--documentation' },
      { label: 'ToastProvider', href: './?path=/story/feedback-toast--provider-queue' },
      { label: 'Modal', href: './?path=/docs/feedback-modal--documentation' },
      { label: 'Badge', href: './?path=/docs/feedback-badge--documentation' },
    ],
    key: 'feedback',
  },
  {
    name: 'Data Display',
    icon: BarChart3,
    accent: 'ai',
    links: [
      { label: 'ScoreGauge', href: './?path=/docs/data-display-scoregauge--documentation' },
      { label: 'DataTable', href: './?path=/docs/data-display-datatable--documentation' },
      { label: 'ProgressBar', href: './?path=/docs/data-display-progressbar--documentation' },
    ],
    key: 'dataDisplay',
  },
  {
    name: 'Surfaces',
    icon: LayoutGrid,
    accent: 'success',
    links: [
      { label: 'Card', href: './?path=/docs/data-display-card--documentation' },
      { label: 'PricingCard', href: './?path=/docs/data-display-pricingcard--documentation' },
    ],
    key: 'surfaces',
  },
  {
    name: 'Templates',
    icon: LayoutDashboard,
    accent: 'brand',
    links: [
      {
        label: 'Candidate Dashboard',
        href: './?path=/docs/templates-candidatedashboard--documentation',
      },
      {
        label: 'Recruiter Dashboard',
        href: './?path=/docs/templates-recruiterdashboard--documentation',
      },
    ],
    key: 'templates',
  },
];

export function Families() {
  const t = useI18n().docs.introduction.families;

  return (
    <div className="sb-unstyled mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {families.map(({ name, icon: Icon, accent, links, key }) => (
        <div
          key={name}
          className={cn(cardSurface, 'flex flex-col gap-2 p-4', softTransition, accents[accent].hover)}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                accents[accent].tile
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <p className={cn('text-xs font-semibold uppercase tracking-wide', mutedTextClass)}>
              {name}
            </p>
          </div>

          <p className="flex flex-wrap items-center gap-x-1.5 text-sm font-semibold">
            {links.map(({ label, href }, index) => (
              <React.Fragment key={label}>
                {index > 0 && (
                  <span className="text-ink-300 dark:text-ink-600" aria-hidden="true">
                    ·
                  </span>
                )}
                <a href={href} target="_top" className={linkClass}>
                  {label}
                </a>
              </React.Fragment>
            ))}
          </p>

          <p className={cn('text-xs leading-relaxed', mutedTextClass)}>{t[key]}</p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Link to the Tokens page                                                    */
/* -------------------------------------------------------------------------- */

export function TokensLink() {
  return (
    <a
      href="./?path=/docs/docs-tokens--documentation"
      target="_top"
      className={cn(linkClass, 'font-semibold')}
    >
      Tokens
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Quality and governance                                                     */
/* -------------------------------------------------------------------------- */

type GovernanceEntry = {
  axis: keyof Dictionary['docs']['introduction']['governance'];
  practice: keyof Dictionary['docs']['introduction']['governance'];
  icon: LucideIcon;
  accent: AccentName;
};

const governance: GovernanceEntry[] = [
  { axis: 'accessibility', practice: 'accessibilityBody', icon: Accessibility, accent: 'success' },
  { axis: 'interactions', practice: 'interactionsBody', icon: FlaskConical, accent: 'ai' },
  { axis: 'viewports', practice: 'viewportsBody', icon: LayoutGrid, accent: 'brand' },
  { axis: 'typing', practice: 'typingBody', icon: FileCode2, accent: 'info' },
];

export function Governance() {
  const t = useI18n().docs.introduction.governance;

  return (
    <div className={cn('sb-unstyled my-4 overflow-x-auto', cardSurface)}>
      <table className="w-full text-left text-xs">
        <thead className="border-b border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-800/60">
          <tr>
            <th scope="col" className="p-3 font-semibold text-ink-900 dark:text-ink-100">
              {t.axis}
            </th>
            <th scope="col" className="p-3 font-semibold text-ink-900 dark:text-ink-100">
              {t.practice}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
          {governance.map(({ axis, icon: Icon, accent, practice }) => (
            <tr key={axis}>
              <th scope="row" className="whitespace-nowrap p-3 text-left font-medium text-ink-900 dark:text-ink-100">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      accents[accent].tile
                    )}
                  >
                    <Icon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {t[axis]}
                </span>
              </th>
              <td className={cn('p-3 leading-relaxed', subtleTextClass)}>{t[practice]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Prose helpers for the MDX bodies                                           */
/* -------------------------------------------------------------------------- */

type IntroTextKey = 'catalogIntro' | 'compoundIntro' | 'tokensNote';
type IntroHeadingKey = 'composablePatterns' | keyof Dictionary['docs']['introduction']['steps'];

/** Paragraph of the Introduction page, resolved from the active locale. */
export function IntroText({ id }: { id: IntroTextKey }) {
  const t = useI18n().docs.introduction;
  return <p className={cn('sb-unstyled my-4 text-sm leading-relaxed', subtleTextClass)}>{t[id]}</p>;
}

/**
 * Turns a dictionary key into an anchor slug: `pinViewport` -> `pin-viewport`.
 *
 * The anchor is built from the key and never from the translated text, so the
 * links of the table of contents survive a change of locale.
 */
export function anchorSlug(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Sub-heading of the Introduction page (h3 level).
 *
 * The `id` is what makes the table of contents work: tocbot builds its links
 * from the heading id, and Storybook's own click handler calls `preventDefault`
 * then bails out when the fragment is empty — so an id-less heading yields a
 * `href="#"` that silently does nothing.
 */
export function IntroHeading({ id }: { id: IntroHeadingKey }) {
  const t = useI18n().docs.introduction;
  const text = id === 'composablePatterns' ? t.composablePatterns : t.steps[id];
  return (
    <h3
      id={anchorSlug(id)}
      className="sb-unstyled mb-2 mt-8 text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50"
    >
      {text}
    </h3>
  );
}

/** Closing sentence of the composable patterns section, with the Tokens link. */
export function SharedUtilities() {
  const t = useI18n().docs.introduction;
  return (
    <p className={cn('sb-unstyled my-4 text-sm leading-relaxed', subtleTextClass)}>
      {t.sharedUtilities} <TokensLink />.
    </p>
  );
}
