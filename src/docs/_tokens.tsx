import { Palette, Ruler, Layers, Type, Focus, MonitorSmartphone, Sparkles } from 'lucide-react';
import { useI18n, type Dictionary } from '../../.storybook/i18n';
import { cn } from '../lib/cn';
import { aquellecColors, aquellecThemeExtensions } from '../lib/design-tokens';
import { focusRing, focusRingDanger, focusRingGhost } from '../lib/focus-ring';
import { mutedTextClass, subtleTextClass } from '../lib/semantic-colors';
import { cardSurface, softTransition } from './_showcase';

/*
  Visual blocks of the Docs/Tokens page.

  Everything shown here is derived from `src/lib/design-tokens.ts`: no hex value
  is copied by hand. Adding a step to a palette or a shadow to the preset updates
  the documentation with no further action, which avoids the drift the previous
  version of this page had accumulated.

  Colors are applied through inline `style` rather than Tailwind classes: they
  come from a runtime object, so no class could be generated statically by the
  compiler.
*/

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function TokensHero() {
  const t = useI18n().docs.tokens;

  return (
    <div
      className={cn(
        'sb-unstyled mb-14 overflow-hidden rounded-2xl border border-brand-500/20',
        'bg-gradient-to-br from-brand-100 via-brand-50 to-ai-50 p-8 shadow-card md:p-10'
      )}
    >
      <div className="flex flex-col items-start gap-4">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          {t.heroKicker}
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          {t.heroTitle}
        </h1>

        <p className={cn('max-w-2xl text-base leading-relaxed md:text-lg', subtleTextClass)}>
          {t.heroDescription}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Color scales                                                               */
/* -------------------------------------------------------------------------- */

/** Steps carrying a documented role, highlighted within the scale. */
const keyShadeRoles: Record<string, keyof Dictionary['docs']['tokens']['roles']> = {
  '500': 'accent',
  '600': 'action',
  '700': 'aaText',
};

function Swatch({ scaleName, shade, hex }: { scaleName: string; shade: string; hex: string }) {
  const roles = useI18n().docs.tokens.roles;
  const roleKey = keyShadeRoles[shade];
  const role = roleKey ? roles[roleKey] : undefined;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'mb-1.5 h-14 w-full rounded-lg border border-slate-900/10',
          role && 'ring-2 ring-slate-900/10 ring-offset-1'
        )}
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <p className="font-mono text-xs font-semibold text-slate-900">
        {scaleName}-{shade}
      </p>
      <p className={cn('font-mono text-xs uppercase', mutedTextClass)}>{hex}</p>
      {role && <p className="text-xs font-medium text-brand-700">{role}</p>}
    </div>
  );
}

export function ColorScale({ name }: { name: 'brand' | 'ai' }) {
  const t = useI18n().docs.tokens;
  const usage = t.scaleUsage[name];
  const scale = aquellecColors[name];

  return (
    <section className={cn('sb-unstyled mb-8 p-5', cardSurface)}>
      {/* Card label, deliberately not an `h3`: the Storybook table of contents
          targets `h3` and would list "brand" / "ai" as sections. */}
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="font-mono text-sm font-bold text-slate-900">{name}</p>
        <p className={cn('text-xs', mutedTextClass)}>{usage}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(scale).map(([shade, hex]) => (
          <Swatch key={shade} scaleName={name} shade={shade} hex={hex} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Semantic tokens                                                            */
/* -------------------------------------------------------------------------- */

const semanticGroups = [
  { key: 'success', tokens: aquellecColors.semantic.success },
  { key: 'error', tokens: aquellecColors.semantic.error },
  { key: 'warning', tokens: aquellecColors.semantic.warning },
  { key: 'info', tokens: aquellecColors.semantic.info },
] as const;

const semanticRoles = ['fg', 'bg', 'border', 'surface'] as const;

export function SemanticTokens() {
  const t = useI18n().docs.tokens.semanticGroups;

  return (
    <div className="sb-unstyled mb-4 grid gap-4 sm:grid-cols-2">
      {semanticGroups.map(({ key, tokens }) => (
        <section key={key} className={cn('flex flex-col gap-3 p-5', cardSurface)}>
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
              style={{ backgroundColor: tokens.bg, color: tokens.fg, borderColor: tokens.border }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{t[key].label}</p>
              <p className={cn('font-mono text-xs', mutedTextClass)}>semantic-{key}-*</p>
            </div>
          </div>

          <p className={cn('text-xs', mutedTextClass)}>{t[key].usage}</p>

          {/* `div` rather than `dl/dt/dd`: Storybook prose styles italicise
              `dt` elements and break the visual alignment. */}
          <div className="grid grid-cols-4 gap-2">
            {semanticRoles.map((role) => (
              <div key={role}>
                <div
                  className="h-8 w-full rounded-md border border-slate-900/10"
                  style={{ backgroundColor: tokens[role] }}
                  aria-hidden="true"
                />
                <p className="mt-1 font-mono text-xs font-semibold text-slate-900">{role}</p>
                <p className={cn('font-mono text-xs uppercase', mutedTextClass)}>{tokens[role]}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Neutral text tones, outside the semantic families. */
export function NeutralText() {
  const t = useI18n().docs.tokens.neutral;
  const neutrals = [
    { token: 'semantic-muted', hex: aquellecColors.semantic.muted, usage: t.muted },
    { token: 'semantic-subtle', hex: aquellecColors.semantic.subtle, usage: t.subtle },
  ];

  return (
    <div className={cn('sb-unstyled mb-4 overflow-x-auto', cardSurface)}>
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th scope="col" className="p-3 font-semibold text-slate-900">{t.token}</th>
            <th scope="col" className="p-3 font-semibold text-slate-900">{t.value}</th>
            <th scope="col" className="p-3 font-semibold text-slate-900">{t.usage}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {neutrals.map(({ token, hex, usage }) => (
            <tr key={token}>
              <th scope="row" className="whitespace-nowrap p-3 text-left">
                <span className="flex items-center gap-2 font-mono font-medium text-slate-900">
                  <span
                    className="inline-block h-4 w-4 shrink-0 rounded border border-slate-900/10"
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  />
                  {token}
                </span>
              </th>
              <td className={cn('p-3 font-mono uppercase', mutedTextClass)}>{hex}</td>
              <td className={cn('p-3 leading-relaxed', subtleTextClass)}>{usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Radii and elevations                                                       */
/* -------------------------------------------------------------------------- */

export function RadiusScale() {
  const t = useI18n().docs.tokens;

  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-500/20">
          <Ruler className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">{t.radii}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(aquellecThemeExtensions.borderRadius).map(([token, value]) => (
          <div key={token}>
            <div
              className="mb-1.5 h-16 w-full border border-brand-500/30 bg-brand-50"
              style={{ borderRadius: value }}
              aria-hidden="true"
            />
            <p className="font-mono text-xs font-semibold text-slate-900">rounded-{token}</p>
            <p className={cn('font-mono text-xs', mutedTextClass)}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ElevationScale() {
  const t = useI18n().docs.tokens;

  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ai-50 text-ai-700 ring-1 ring-ai-500/20">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">{t.elevations}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {Object.entries(aquellecThemeExtensions.boxShadow).map(([token, value]) => (
          <div key={token}>
            <div
              className="mb-2.5 h-16 w-full rounded-xl border border-slate-100 bg-white"
              style={{ boxShadow: value }}
              aria-hidden="true"
            />
            <p className="font-mono text-xs font-semibold text-slate-900">shadow-{token}</p>
            <p className={cn('break-all font-mono text-xs', mutedTextClass)}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Typography                                                                 */
/* -------------------------------------------------------------------------- */

const typeScale: Array<{
  token: string;
  size: string;
  usage: keyof Dictionary['docs']['tokens']['typeUsage'];
}> = [
  { token: 'text-xs', size: '12px', usage: 'xs' },
  { token: 'text-sm', size: '14px', usage: 'sm' },
  { token: 'text-base', size: '16px', usage: 'base' },
  { token: 'text-lg', size: '18px', usage: 'lg' },
  { token: 'text-xl', size: '20px', usage: 'xl' },
  { token: 'text-2xl', size: '24px', usage: 'xl2' },
  { token: 'text-3xl', size: '30px', usage: 'xl3' },
];

export function TypeScale() {
  const t = useI18n().docs.tokens;

  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-semantic-info-bg text-semantic-info-fg ring-1 ring-semantic-info-border">
          <Type className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t.typeScale}</p>
          <p className={cn('text-xs', mutedTextClass)}>
            {t.typeScaleSubtitle} (<code>font-sans</code>)
          </p>
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {typeScale.map(({ token, size, usage }) => (
          <li key={token} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5">
            <span className={cn(token, 'min-w-0 flex-1 font-semibold text-slate-900')}>
              {t.typeSample}
            </span>
            <span className="font-mono text-xs font-semibold text-slate-900">{token}</span>
            <span className={cn('w-12 text-right font-mono text-xs', mutedTextClass)}>{size}</span>
            <span className={cn('w-full text-xs sm:w-56 sm:text-right', mutedTextClass)}>
              {t.typeUsage[usage]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Focus                                                                      */
/* -------------------------------------------------------------------------- */

const focusVariants: Array<{
  name: string;
  className: string;
  label: keyof Dictionary['docs']['tokens']['focusVariants'];
  accent: string;
}> = [
  { name: 'focusRing', className: focusRing, label: 'standard', accent: 'bg-brand-600 text-white' },
  {
    name: 'focusRingDanger',
    className: focusRingDanger,
    label: 'destructive',
    accent: 'bg-rose-600 text-white',
  },
  {
    name: 'focusRingGhost',
    className: focusRingGhost,
    label: 'quiet',
    accent: 'bg-slate-100 text-slate-800',
  },
];

export function FocusRings() {
  const t = useI18n().docs.tokens;

  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-1 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-semantic-success-bg text-semantic-success-fg ring-1 ring-semantic-success-border">
          <Focus className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">{t.focusRings}</p>
      </div>

      <p className={cn('text-xs', mutedTextClass)}>{t.focusIntro}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        {focusVariants.map(({ name, className, label, accent }) => (
          <button
            key={name}
            type="button"
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium',
              softTransition,
              accent,
              className
            )}
          >
            {t.focusVariants[label]}
            <span className="font-mono text-xs opacity-80">{name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Viewports                                                                  */
/* -------------------------------------------------------------------------- */

/** Must stay aligned with `aquellecViewports` in `.storybook/preview.tsx`. */
const viewports = [
  { key: 'mobile', name: 'Mobile', size: '375 × 812' },
  { key: 'tablet', name: 'Tablet', size: '768 × 1024' },
  { key: 'desktop', name: 'Desktop', size: '1280 × 800' },
  { key: 'wide', name: 'Wide', size: '1536 × 900' },
];

export function Viewports() {
  const t = useI18n().docs.tokens;

  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-semantic-warning-bg text-semantic-warning-fg ring-1 ring-semantic-warning-border">
          <MonitorSmartphone className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">{t.viewportsTitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {viewports.map(({ key, name, size }) => (
          <div key={key} className="flex flex-col gap-0.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <p className={cn('font-mono text-xs', mutedTextClass)}>{key}</p>
            <p className={cn('font-mono text-xs', subtleTextClass)}>{size}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Prose helpers for the MDX body                                             */
/* -------------------------------------------------------------------------- */

type TokensTextKey =
  | 'brandIntro'
  | 'semanticIntro'
  | 'semanticNote'
  | 'focusNote'
  | 'pinViewportNote'
  | 'shortcuts'
  | 'presetIntro'
  | 'presetNote'
  | 'outsideIntro'
  | 'outsideNote';

type TokensHeadingKey = 'pinViewport' | 'presetHeading' | 'outsideHeading';

/** Paragraph of the Tokens page, resolved from the active locale. */
export function TokensText({ id }: { id: TokensTextKey }) {
  const t = useI18n().docs.tokens;
  return <p className={cn('sb-unstyled my-4 text-sm leading-relaxed', subtleTextClass)}>{t[id]}</p>;
}

/** Sub-heading of the Tokens page (h3 level). */
export function TokensHeading({ id }: { id: TokensHeadingKey }) {
  const t = useI18n().docs.tokens;
  return (
    <h3 className="sb-unstyled mb-2 mt-8 text-lg font-bold tracking-tight text-slate-900">
      {t[id]}
    </h3>
  );
}
