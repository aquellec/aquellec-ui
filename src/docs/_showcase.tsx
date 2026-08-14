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
  Palette,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useI18n, type Dictionary } from '../../.storybook/i18n';
import { cn } from '../lib/cn';
import { focusRing } from '../lib/focus-ring';
import { mutedTextClass, subtleTextClass } from '../lib/semantic-colors';

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
type AccentName = 'brand' | 'ai' | 'info' | 'success' | 'warning';

interface Accent {
  /** Icon chip: tinted background plus ring. */
  tile: string;
  /** Top accent bar of the pillar cards. */
  bar: string;
  /** Card border on hover. */
  hover: string;
}

const accents: Record<AccentName, Accent> = {
  brand: {
    tile: 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20',
    bar: 'bg-brand-500',
    hover: 'hover:border-brand-500/40',
  },
  ai: {
    tile: 'bg-ai-50 text-ai-700 ring-1 ring-ai-500/20',
    bar: 'bg-ai-500',
    hover: 'hover:border-ai-500/40',
  },
  info: {
    tile: 'bg-semantic-info-bg text-semantic-info-fg ring-1 ring-semantic-info-border',
    bar: 'bg-semantic-info-fg',
    hover: 'hover:border-semantic-info-fg/40',
  },
  success: {
    tile: 'bg-semantic-success-bg text-semantic-success-fg ring-1 ring-semantic-success-border',
    bar: 'bg-semantic-success-fg',
    hover: 'hover:border-semantic-success-fg/40',
  },
  warning: {
    tile: 'bg-semantic-warning-bg text-semantic-warning-fg ring-1 ring-semantic-warning-border',
    bar: 'bg-semantic-warning-fg',
    hover: 'hover:border-semantic-warning-fg/40',
  },
};

/** Shared card surface: consistent radius and elevation. */
export const cardSurface = 'rounded-xl border border-slate-200 bg-white shadow-card';

/** Transitions neutralised when the user asks for reduced motion. */
export const softTransition = 'transition-colors duration-200 motion-reduce:transition-none';

const linkClass = cn(
  'rounded-sm text-brand-700 underline decoration-brand-500/40 underline-offset-2',
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
    <header className="sb-unstyled mb-6 mt-14 flex flex-col gap-2">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-700">
        <span className="h-px w-6 bg-brand-500/40" aria-hidden="true" />
        {kicker}
      </p>
      <h2 id={id} className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h2>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

type ChipKey = keyof Dictionary['docs']['introduction']['chips'];

const heroChips: Array<{ key: ChipKey; icon: LucideIcon; className: string }> = [
  {
    key: 'typescript',
    icon: FileCode2,
    className: 'border-semantic-info-border bg-semantic-info-bg text-semantic-info-fg',
  },
  {
    key: 'wcag',
    icon: Accessibility,
    className: 'border-semantic-success-border bg-semantic-success-bg text-semantic-success-fg',
  },
  {
    key: 'preset',
    icon: Palette,
    className: 'border-brand-500/30 bg-brand-50 text-brand-700',
  },
  {
    key: 'storybook',
    icon: FlaskConical,
    className: 'border-ai-500/30 bg-ai-50 text-ai-700',
  },
];

export function Hero() {
  const t = useI18n().docs.introduction;

  return (
    <div
      className={cn(
        'sb-unstyled mb-14 overflow-hidden rounded-2xl border border-brand-500/20',
        'bg-gradient-to-br from-brand-100 via-brand-50 to-ai-50 p-8 shadow-card md:p-10'
      )}
    >
      <div>
        <div className="flex flex-col items-start gap-4">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t.heroKicker}
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            @aquellec/ui
          </h1>

          <p className={cn('max-w-2xl text-base leading-relaxed md:text-lg', subtleTextClass)}>
            {t.heroDescription}
          </p>

          <ul className="flex list-none flex-wrap gap-2 pt-3">
            {heroChips.map(({ key, icon: Icon, className }) => (
              <li
                key={key}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium',
                  className
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t.chips[key]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
              <p className="text-sm font-semibold text-slate-900">{t[key].title}</p>
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
                  <span className="text-slate-300" aria-hidden="true">
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
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th scope="col" className="p-3 font-semibold text-slate-900">
              {t.axis}
            </th>
            <th scope="col" className="p-3 font-semibold text-slate-900">
              {t.practice}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {governance.map(({ axis, icon: Icon, accent, practice }) => (
            <tr key={axis}>
              <th scope="row" className="whitespace-nowrap p-3 text-left font-medium text-slate-900">
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

/** Sub-heading of the Introduction page (h3 level). */
export function IntroHeading({ id }: { id: IntroHeadingKey }) {
  const t = useI18n().docs.introduction;
  const text = id === 'composablePatterns' ? t.composablePatterns : t.steps[id];
  return (
    <h3 className="sb-unstyled mb-2 mt-8 text-lg font-bold tracking-tight text-slate-900">{text}</h3>
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
