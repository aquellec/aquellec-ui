import { Palette, Ruler, Layers, Type, Focus, MonitorSmartphone, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';
import { aquellecColors, aquellecThemeExtensions } from '../lib/design-tokens';
import { focusRing, focusRingDanger, focusRingGhost } from '../lib/focus-ring';
import { mutedTextClass, subtleTextClass } from '../lib/semantic-colors';
import { cardSurface, softTransition } from './_showcase';

/*
  Blocs visuels de la page Docs/Tokens.

  Tout ce qui est affiché ici est **dérivé de `src/lib/design-tokens.ts`** :
  aucune valeur hexadécimale n'est recopiée. Ajouter un palier à la palette ou
  une ombre au preset met la documentation à jour sans intervention, ce qui
  évite la dérive constatée sur la version précédente de cette page.

  Les couleurs sont posées en `style` inline et non en classes Tailwind : elles
  proviennent d'un objet au runtime, donc aucune classe ne pourrait être
  générée statiquement par le compilateur.
*/

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function TokensHero() {
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
          Fondations · Preset Tailwind
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Design Tokens
        </h1>

        <p className={cn('max-w-2xl text-base leading-relaxed md:text-lg', subtleTextClass)}>
          Source unique des fondations&nbsp;: <code className="text-sm">src/lib/design-tokens.ts</code>.
          Le preset Tailwind exporté par le package et cette page sont générés depuis ce même
          fichier — les valeurs ci-dessous sont donc toujours celles réellement compilées.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Échelles de couleur                                                        */
/* -------------------------------------------------------------------------- */

/** Paliers qui portent un rôle documenté, mis en avant dans l'échelle. */
const keyShades: Record<string, string> = {
  '500': 'Accent',
  '600': 'Action',
  '700': 'Texte AA',
};

function Swatch({ scaleName, shade, hex }: { scaleName: string; shade: string; hex: string }) {
  const role = keyShades[shade];

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

export function ColorScale({
  name,
  usage,
}: {
  name: 'brand' | 'ai';
  usage: string;
}) {
  const scale = aquellecColors[name];

  return (
    <section className={cn('sb-unstyled mb-8 p-5', cardSurface)}>
      {/* Libellé de carte, volontairement pas un `h3` : le sommaire Storybook
          cible les `h3` et remonterait « brand » / « ai » comme sections. */}
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
/*  Tokens sémantiques                                                         */
/* -------------------------------------------------------------------------- */

const semanticGroups = [
  { key: 'success', label: 'Succès', usage: 'Match validé, import réussi', tokens: aquellecColors.semantic.success },
  { key: 'error', label: 'Erreur', usage: 'Rejet, échec de parsing', tokens: aquellecColors.semantic.error },
  { key: 'warning', label: 'Alerte', usage: 'Quota proche, score moyen', tokens: aquellecColors.semantic.warning },
  { key: 'info', label: 'Information', usage: 'Neutre, aide contextuelle', tokens: aquellecColors.semantic.info },
] as const;

const semanticRoles = ['fg', 'bg', 'border', 'surface'] as const;

export function SemanticTokens() {
  return (
    <div className="sb-unstyled mb-4 grid gap-4 sm:grid-cols-2">
      {semanticGroups.map(({ key, label, usage, tokens }) => (
        <section key={key} className={cn('flex flex-col gap-3 p-5', cardSurface)}>
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
              style={{ backgroundColor: tokens.bg, color: tokens.fg, borderColor: tokens.border }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className={cn('font-mono text-xs', mutedTextClass)}>semantic-{key}-*</p>
            </div>
          </div>

          <p className={cn('text-xs', mutedTextClass)}>{usage}</p>

          {/* `div` plutôt que `dl/dt/dd` : les styles prose de Storybook
              mettent les `dt` en italique et cassent l'alignement visuel. */}
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

/** Tons de texte neutres, hors familles sémantiques. */
export function NeutralText() {
  const neutrals = [
    { token: 'semantic-muted', hex: aquellecColors.semantic.muted, usage: 'Texte secondaire, légendes' },
    { token: 'semantic-subtle', hex: aquellecColors.semantic.subtle, usage: 'Corps de texte atténué, contrôles' },
  ];

  return (
    <div className={cn('sb-unstyled mb-4 overflow-x-auto', cardSurface)}>
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th scope="col" className="p-3 font-semibold text-slate-900">Token</th>
            <th scope="col" className="p-3 font-semibold text-slate-900">Valeur</th>
            <th scope="col" className="p-3 font-semibold text-slate-900">Usage</th>
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
/*  Rayons et élévations                                                       */
/* -------------------------------------------------------------------------- */

export function RadiusScale() {
  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-500/20">
          <Ruler className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">Rayons</p>
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
  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ai-50 text-ai-700 ring-1 ring-ai-500/20">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">Élévations</p>
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
/*  Typographie                                                                */
/* -------------------------------------------------------------------------- */

const typeScale = [
  { token: 'text-xs', size: '12px', usage: 'Labels, badges, métadonnées' },
  { token: 'text-sm', size: '14px', usage: 'Corps de texte, tableaux, formulaires' },
  { token: 'text-base', size: '16px', usage: 'Titres de modale, contenu principal' },
  { token: 'text-lg', size: '18px', usage: 'Titres de section' },
  { token: 'text-xl', size: '20px', usage: 'En-têtes de page template' },
  { token: 'text-2xl', size: '24px', usage: 'KPI dashboard' },
  { token: 'text-3xl', size: '30px', usage: 'Hero pricing' },
];

export function TypeScale() {
  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-semantic-info-bg text-semantic-info-fg ring-1 ring-semantic-info-border">
          <Type className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Échelle typographique</p>
          <p className={cn('text-xs', mutedTextClass)}>
            Utilitaires Tailwind par défaut · police système (<code>font-sans</code>)
          </p>
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {typeScale.map(({ token, size, usage }) => (
          <li key={token} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5">
            <span className={cn(token, 'min-w-0 flex-1 font-semibold text-slate-900')}>
              Optimisez votre CV pour les ATS
            </span>
            <span className="font-mono text-xs font-semibold text-slate-900">{token}</span>
            <span className={cn('w-12 text-right font-mono text-xs', mutedTextClass)}>{size}</span>
            <span className={cn('w-full text-xs sm:w-56 sm:text-right', mutedTextClass)}>{usage}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Focus                                                                      */
/* -------------------------------------------------------------------------- */

const focusVariants = [
  { name: 'focusRing', className: focusRing, label: 'Contrôle standard', accent: 'bg-brand-600 text-white' },
  { name: 'focusRingDanger', className: focusRingDanger, label: 'Action destructive', accent: 'bg-rose-600 text-white' },
  { name: 'focusRingGhost', className: focusRingGhost, label: 'Bouton discret', accent: 'bg-slate-100 text-slate-800' },
];

export function FocusRings() {
  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-1 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-semantic-success-bg text-semantic-success-fg ring-1 ring-semantic-success-border">
          <Focus className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">Anneaux de focus</p>
      </div>

      <p className={cn('text-xs', mutedTextClass)}>
        Centralisés dans <code>src/lib/focus-ring.ts</code>. Naviguez au clavier
        (<kbd className="rounded border border-slate-300 bg-slate-50 px-1">Tab</kbd>) pour les voir —
        ils sont en <code>focus-visible</code>, donc invisibles au clic.
      </p>

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
            {label}
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

/** Doit rester aligné sur `aquellecViewports` dans `.storybook/preview.ts`. */
const viewports = [
  { key: 'mobile', name: 'Mobile', size: '375 × 812' },
  { key: 'tablet', name: 'Tablet', size: '768 × 1024' },
  { key: 'desktop', name: 'Desktop', size: '1280 × 800' },
  { key: 'wide', name: 'Wide', size: '1536 × 900' },
];

export function Viewports() {
  return (
    <section className={cn('sb-unstyled mb-4 p-5', cardSurface)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-semantic-warning-bg text-semantic-warning-fg ring-1 ring-semantic-warning-border">
          <MonitorSmartphone className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-slate-900">Viewports Storybook</p>
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
