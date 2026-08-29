# @aquellec/ui

Composants UI React pour applications SaaS de recrutement (analyse de CV, matching ATS, espaces candidat et recruteur).

**📖 [Documentation interactive](https://27473af902f42be3efeb0973435f662f.share.chromatic.com)** — Storybook publié : composants, pages Tokens et Introduction, templates de dashboard.

## Pourquoi ce projet ?

Une librairie créée pour alimenter mes projets perso (Dashboard Next.js & API Python d'analyse de CV). L'objectif était de construire des composants propres, accessibles et directement réutilisables pour des interfaces SaaS.

**Stack :** React 19, TypeScript, Tailwind CSS, Lucide Icons.

**Documentation & tests :** Storybook 10 (a11y, viewports, tests d'interaction Vitest).

## Installation

```bash
pnpm add @aquellec/ui lucide-react
```

`react`, `react-dom` et `lucide-react` sont des **peer dependencies** — à installer dans l'application hôte. `tailwindcss` est une peer dependency optionnelle, nécessaire uniquement pour utiliser le preset.

### Configurer Tailwind

Le package ne publie aucune feuille de style : les tokens arrivent par le preset.

```ts
// tailwind.config.ts
import aquellecPreset from '@aquellec/ui/tailwind-preset';

export default {
  presets: [aquellecPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@aquellec/ui/dist/**/*.{js,mjs}',
  ],
};
```

Le preset apporte les palettes `brand`, `ai` et `semantic.*`, les rayons et élévations partagés, et neutralise les animations sous `prefers-reduced-motion`.

#### Tailwind 4

The package supports both major lines, but they are wired differently. Tailwind 4
reads a CSS-first configuration and does **not** pick up `tailwind.config.js` on
its own — the style sheet has to point at it:

```css
@import "tailwindcss";
@config "./tailwind.config.js";
```

That single line is what makes the preset apply. Without it the build still
succeeds and reports nothing, but the result is silently broken: none of the
`brand`, `ai` or `semantic` tokens are generated, the shared shadows are absent,
and `dark:` falls back to `prefers-color-scheme` instead of the `class` strategy
the components rely on.

`pnpm check:tailwind-v4` compiles the built preset against the current Tailwind 4
and asserts all of the above; it runs in CI, so the peer range and the behaviour
cannot drift apart.

### Dark mode

The preset enables Tailwind's `class` strategy, so every component ships light
and dark styles and follows whichever the host application asks for. Add the
`dark` class on `<html>` — or on any ancestor — and the subtree switches:

```ts
document.documentElement.classList.toggle('dark', isDark);
```

Nothing else is required: the preset also pins `color-scheme`, so scrollbars and
native form chrome follow the theme.

To follow the operating system instead of an explicit toggle:

```ts
const media = window.matchMedia('(prefers-color-scheme: dark)');
const apply = () => document.documentElement.classList.toggle('dark', media.matches);
apply();
media.addEventListener('change', apply);
```

Surfaces and copy tones are exported so an application can build matching
screens around the components, each constant carrying both sides of the theme:

```ts
import {
  pageSurfaceClass,    // page canvas
  raisedSurfaceClass,  // cards, dialogs
  sunkenSurfaceClass,  // table headers, footers
  surfaceBorderClass,
  dividerBorderClass,
  controlBorderClass,
  strongTextClass,
  bodyTextClass,
  mutedTextClass,
  subtleTextClass,
  brandAccentClass,
  aiAccentClass,
} from '@aquellec/ui';
```

### Utiliser un composant

```tsx
import { Button, Card, Dropzone, ToastProvider, useToast } from '@aquellec/ui';

export function App() {
  return (
    <ToastProvider>
      <Card className="max-w-md">
        <Card.Header title="Importer un CV" />
        <Card.Body>
          <Dropzone accept=".pdf" maxSizeMB={5} onFileSelect={(file) => console.log(file.name)} />
        </Card.Body>
      </Card>
    </ToastProvider>
  );
}
```

## Composants inclus

Les composants sont génériques : aucun texte métier n'est codé en dur, tout passe par les props.

| Famille | Composants |
| --- | --- |
| **Actions** | `Button` (5 variantes dont IA), `SegmentedControl` (segments exclusifs, options en prop) |
| **Forms** | `Input`, `Textarea` (compteur de caractères), `Dropzone` (upload PDF, mono ou multi-fichiers) |
| **Feedback** | `Toast` + `ToastProvider` / `useToast`, `Modal` (focus trap, `inert`), `Badge` |
| **Data Display** | `ScoreGauge` (score 0–100), `DataTable` (pagination, skeleton), `ProgressBar` (quota, seuils configurables), `Card` (+ `Header` / `Body` / `Footer`), `PricingCard` |

**Templates** — dashboards Candidat et Recruteur complets, assemblés dans Storybook.

### Utilitaires exportés

```ts
import {
  cn,                          // clsx + tailwind-merge
  aquellecColors,              // tokens bruts, hors Tailwind
  aquellecThemeExtensions,     // rayons et élévations
  focusRing,                   // + focusRingDanger, focusRingGhost
  getScoreTextClass,           // couleur de texte selon le palier de score
} from '@aquellec/ui';
```

## Choix techniques

- **Composables** — sous-composants (`Card.Header`, `Modal.Footer`) pour garder de la flexibilité.
- **Accessibilité** — patterns WAI-ARIA APG, navigation clavier, `:focus-visible` centralisé, `prefers-reduced-motion`. L'addon a11y tourne en mode bloquant (`test: 'error'`) : une violation axe fait échouer la CI.
- **Styles** — `tailwind-merge` + `clsx` pour surcharger les classes sans conflit.
- **Typage** — `strict: true`, unions discriminées (`Dropzone` single / multiple), déclarations `.d.ts` générées.
- **Localisation** — aucun texte n'est figé : `Dropzone` et `DataTable` acceptent une prop `labels`, `Modal` et `Toast` un `closeLabel`, `ScoreGauge` des `statusLabels`. Les valeurs par défaut sont en français ; les défauts sont exportés (`defaultDropzoneLabels`, etc.) pour servir de base à une traduction.
- **Distribution** — dual ESM / CJS, `sideEffects: false` pour le tree-shaking.
- **Primitives headless** — réservées aux futurs widgets flottants ou composites (`Select`, `Combobox`, `Popover`, `Tooltip`, `Menu`) ; les patterns APG simples restent maison. Voir [ADR 0001](docs/adr/0001-primitives-headless.md).

## Développement local

```bash
pnpm install
pnpm playwright:install   # Chromium, requis pour les tests

pnpm dev                  # Storybook → http://localhost:6006
pnpm type-check           # tsc --noEmit
pnpm build                # Build ESM/CJS + types dans dist/
pnpm test:storybook       # Tests d'interaction et a11y (Vitest browser mode)
pnpm build-storybook      # Export statique de la doc
```

The Storybook toolbar carries a **Theme** switch (Light / Dark) driving the
stories and the documentation pages alike. The whole suite can be replayed in
dark mode, where the blocking a11y addon checks contrast against the dark
palette rather than assuming it:

```bash
STORYBOOK_THEME=dark pnpm test:storybook
```

Les blocs visuels des pages MDX vivent dans `src/docs/_showcase.tsx` et `src/docs/_tokens.tsx`, et portent la classe `sb-unstyled` : sans elle, les styles de doc de Storybook écrasent les utilitaires Tailwind.

Toute évolution de token passe par `src/lib/design-tokens.ts` — le preset et la page Tokens en découlent automatiquement.

## Limitations connues

- **Next.js App Router** — la directive `"use client"` n'est pas encore émise au build. Importez les composants depuis un Client Component en attendant.
- Le composant `DataTable` n'est pas virtualisé : il est prévu pour des vues paginées.

## Licence

MIT — Amandine Quellec
