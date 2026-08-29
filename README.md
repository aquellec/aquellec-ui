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

Tailwind 4 reads a CSS-first configuration. Import the published style sheet from
your own, and skip the JavaScript config entirely:

```css
@import "tailwindcss";
@import "@aquellec/ui/theme.css";
```

That single import carries the palettes, the shared radii and elevations, the
`dark` variant on the `class` strategy, and the base layers. It also registers
this package's own bundles as a content source, so — unlike v3 — there is nothing
to add to `content` for the components to be styled.

An application already on a v3-style config can keep it, reaching it from the
style sheet instead:

```css
@import "tailwindcss";
@config "./tailwind.config.js";
```

**One of those two lines is required.** Without either, a v4 build still succeeds
and reports nothing, but silently produces a style sheet with none of the tokens,
none of the shared shadows, and `dark:` bound to `prefers-color-scheme` instead
of the `class` strategy the components rely on.

`dist/theme.css` is generated from `src/lib/design-tokens.ts` at build time, so
the preset and the style sheet are two renderings of one source and cannot drift.
`pnpm check:tailwind-v4` compiles both paths against the current Tailwind 4 and
asserts all of the above; it runs in CI.

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
