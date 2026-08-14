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
import { cn } from '../lib/cn';
import { focusRing } from '../lib/focus-ring';
import { mutedTextClass, subtleTextClass } from '../lib/semantic-colors';

/*
  Blocs visuels de la page Docs/Introduction, également réutilisés par
  Docs/Tokens (`_tokens.tsx`) pour que les deux pages partagent le même
  langage visuel : mêmes surfaces, mêmes accents, mêmes en-têtes de section.

  Ils vivent dans un `.tsx` plutôt qu'en classes inline dans le MDX pour être
  partageables et typés. Le glob Tailwind couvre désormais aussi `.mdx`
  (`tailwind.config.ts` → content), donc ce n'est plus une contrainte de
  compilation, mais la convention reste : le style vit dans les composants.

  Chaque bloc porte `sb-unstyled` : Storybook applique ses styles de doc à
  tous les éléments d'une page MDX (`.css-xxx :where(div:not(.sb-unstyled…))`,
  idem pour p, ul, li, les titres et les tableaux), à égalité de spécificité
  avec les utilitaires
  Tailwind — mais injectés après, donc gagnants. Résultat sans ce marqueur :
  `text-xs` rendait 16px et `font-mono` restait en Inter. `sb-unstyled` est
  l'échappatoire officielle, honorée par toutes leurs règles.
*/

/** Accents dérivés exclusivement des tokens du preset (brand / ai / semantic). */
type AccentName = 'brand' | 'ai' | 'info' | 'success' | 'warning';

interface Accent {
  /** Pastille d'icône : fond teinté + anneau. */
  tile: string;
  /** Barre d'accent supérieure des piliers. */
  bar: string;
  /** Bordure au survol des cartes. */
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

/** Surface de carte commune : radius + élévation homogènes. */
export const cardSurface = 'rounded-xl border border-slate-200 bg-white shadow-card';

/** Transitions neutralisées si l'utilisateur réduit les animations. */
export const softTransition = 'transition-colors duration-200 motion-reduce:transition-none';

const linkClass = cn(
  'rounded-sm text-brand-700 underline decoration-brand-500/40 underline-offset-2',
  'hover:decoration-brand-500',
  softTransition,
  focusRing
);

/* -------------------------------------------------------------------------- */
/*  En-tête de section : eyebrow + titre                                       */
/* -------------------------------------------------------------------------- */

export function SectionHeader({
  kicker,
  title,
  id,
}: {
  kicker: string;
  title: string;
  id: string;
}) {
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

const heroChips: Array<{ label: string; icon: LucideIcon; className: string }> = [
  {
    label: 'TypeScript strict',
    icon: FileCode2,
    className:
      'border-semantic-info-border bg-semantic-info-bg text-semantic-info-fg',
  },
  {
    label: 'WCAG 2.1 AA',
    icon: Accessibility,
    className:
      'border-semantic-success-border bg-semantic-success-bg text-semantic-success-fg',
  },
  {
    label: 'Preset Tailwind exportable',
    icon: Palette,
    className: 'border-brand-500/30 bg-brand-50 text-brand-700',
  },
  {
    label: 'Storybook 10 + Vitest',
    icon: FlaskConical,
    className: 'border-ai-500/30 bg-ai-50 text-ai-700',
  },
];

export function Hero() {
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
            Design System · React 19 · Tailwind CSS
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            @aquellec/ui
          </h1>

          <p className={cn('max-w-2xl text-base leading-relaxed md:text-lg', subtleTextClass)}>
            Librairie de composants React typés pour applications SaaS de recrutement et d&apos;analyse
            IA&nbsp;: parsing de CV, matching ATS, espaces Candidat / Recruteur, quotas et
            visualisation de scores.
          </p>

          <ul className="flex list-none flex-wrap gap-2 pt-3">
            {heroChips.map(({ label, icon: Icon, className }) => (
              <li
                key={label}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium',
                  className
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Les piliers                                                                */
/* -------------------------------------------------------------------------- */

interface Pillar {
  title: string;
  icon: LucideIcon;
  accent: AccentName;
  body: React.ReactNode;
}

const inlineCode = 'rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-800';

const pillars: Pillar[] = [
  {
    title: "Accessibilité d'abord",
    icon: ShieldCheck,
    accent: 'brand',
    body: (
      <>
        Composants calés sur les patterns WAI-ARIA APG&nbsp;: labels associés, live regions, rôles
        sémantiques (<code className={inlineCode}>radiogroup</code>,{' '}
        <code className={inlineCode}>dialog</code>). Modale avec focus trap (
        <code className={inlineCode}>focusin</code>), restitution du focus, touche{' '}
        <kbd className="rounded border border-slate-300 bg-slate-50 px-1 text-xs">Escape</kbd> et
        contenu de fond <code className={inlineCode}>inert</code>. Contrastes visés WCAG 2.1 AA,
        validés via l&apos;addon A11y Storybook.
      </>
    ),
  },
  {
    title: 'Métier SaaS recrutement',
    icon: Sparkles,
    accent: 'ai',
    body: (
      <>
        Composants pensés pour les parcours réels&nbsp;: upload PDF (<strong>Dropzone</strong>),
        bascule Candidat / Recruteur (<strong>SegmentedControl</strong>), jauge de score ATS (
        <strong>ScoreGauge</strong>), tableaux paginés (<strong>DataTable</strong>), barres de quota
        (<strong>ProgressBar</strong>) et cartes tarifaires. Templates dashboard disponibles dans la
        section <strong>Templates</strong>.
      </>
    ),
  },
  {
    title: 'Developer Experience',
    icon: Code2,
    accent: 'info',
    body: (
      <>
        API en <code className={inlineCode}>React.forwardRef</code>, props étendues depuis les
        attributs HTML natifs, unions TypeScript discriminées (<strong>Dropzone</strong> single /
        multiple). Styles via <code className={inlineCode}>cn()</code> (clsx + tailwind-merge).
        Runtime léger&nbsp;: pas de lib UI lourde — <code className={inlineCode}>lucide-react</code>{' '}
        en peer dependency uniquement.
      </>
    ),
  },
];

export function Pillars() {
  return (
    <div className="sb-unstyled mb-4 grid gap-4 md:grid-cols-3">
      {pillars.map(({ title, icon: Icon, accent, body }) => (
        <div key={title} className={cn(cardSurface, 'overflow-hidden')}>
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
              <p className="text-sm font-semibold text-slate-900">{title}</p>
            </div>
            <p className={cn('text-sm leading-relaxed', subtleTextClass)}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Architecture : les familles de composants                                  */
/* -------------------------------------------------------------------------- */

interface Family {
  name: string;
  icon: LucideIcon;
  accent: AccentName;
  links: Array<{ label: string; href: string }>;
  description: string;
}

/*
  Liens de navigation : les pages Autodocs sont nommées « Documentation »
  (.storybook/main.ts → docs.defaultName), leur identifiant est donc
  `<title-kebab>--documentation` et non `--docs`.
  Les pages MDX étant rendues dans l'iframe de preview, chaque lien utilise
  une URL relative (`./?path=…`) + `target="_top"` pour piloter le manager.
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
    description: 'Boutons primaires / IA, segments exclusifs avec navigation clavier.',
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
    description: 'Formulaires avec erreurs ARIA, zone de dépôt PDF native label + drag-and-drop.',
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
    description:
      "Notifications live region, file d'attente via provider, dialogues modaux, statuts compacts.",
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
    description: 'Score ATS, tableaux paginés avec skeleton, quotas et consommation.',
  },
  {
    name: 'Surfaces',
    icon: LayoutGrid,
    accent: 'success',
    links: [
      { label: 'Card', href: './?path=/docs/data-display-card--documentation' },
      { label: 'PricingCard', href: './?path=/docs/data-display-pricingcard--documentation' },
    ],
    description: 'Surfaces composables Header / Body / Footer, cartes offre SaaS.',
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
    description: 'Pages de référence assemblant les composants en contexte produit.',
  },
];

export function Families() {
  return (
    <div className="sb-unstyled mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {families.map(({ name, icon: Icon, accent, links, description }) => (
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

          <p className={cn('text-xs leading-relaxed', mutedTextClass)}>{description}</p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lien vers la page Tokens                                                   */
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
/*  Qualité & gouvernance                                                      */
/* -------------------------------------------------------------------------- */

const governance: Array<{
  axis: string;
  icon: LucideIcon;
  accent: AccentName;
  practice: React.ReactNode;
}> = [
  {
    axis: 'Accessibilité',
    icon: Accessibility,
    accent: 'success',
    practice: (
      <>
        Addon <code className={inlineCode}>@storybook/addon-a11y</code> activé sur chaque story
      </>
    ),
  },
  {
    axis: 'Interactions',
    icon: FlaskConical,
    accent: 'ai',
    practice: (
      <>
        Tests <code className={inlineCode}>play()</code> Vitest via{' '}
        <code className={inlineCode}>@storybook/addon-vitest</code>
      </>
    ),
  },
  {
    axis: 'Viewports',
    icon: LayoutGrid,
    accent: 'brand',
    practice: <>Mobile 375 · Tablet 768 · Desktop 1280 · Wide 1536</>,
  },
  {
    axis: 'Typage',
    icon: FileCode2,
    accent: 'info',
    practice: (
      <>
        <code className={inlineCode}>strict: true</code>, déclarations{' '}
        <code className={inlineCode}>.d.ts</code> générées dans{' '}
        <code className={inlineCode}>dist/</code>
      </>
    ),
  },
];

export function Governance() {
  return (
    <div className={cn('sb-unstyled my-4 overflow-x-auto', cardSurface)}>
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th scope="col" className="p-3 font-semibold text-slate-900">
              Axe
            </th>
            <th scope="col" className="p-3 font-semibold text-slate-900">
              Pratique
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
                  {axis}
                </span>
              </th>
              <td className={cn('p-3 leading-relaxed', subtleTextClass)}>{practice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
