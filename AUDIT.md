# Audit `@aquellec/ui` — 13 août 2026

> Audit **read-only**. Aucun fichier source n'a été modifié, aucune dépendance installée, aucun build/test/git lancé.
> Les mesures citées proviennent de la lecture des sources et de l'inspection des artefacts déjà présents dans le workspace (`dist/`, `storybook-static/`).

---

## 1. Résumé exécutif

La librairie est solide sur le fond (API typées, compound components, focus trap maison, 39 stories dont 27 avec `play`), mais trois défauts la rendent aujourd'hui risquée à publier : **aucune directive `"use client"`** (cassure immédiate en Next.js App Router), **`sideEffects` absent** (tree-shaking non garanti sur un bundle monolithique de 53,4 Ko), et **des tokens de couleur référencés mais non définis** (`ai-200`, `brand-200/300`) qui produisent des classes inexistantes dans le CSS compilé. Côté qualité, le garde-fou d'accessibilité est désarmé (`a11y.test: 'todo'`) et `src/lib/` n'a aucun test unitaire. Les correctifs P0/P1 représentent environ une journée de travail ; la migration Tailwind v4 est un chantier distinct de 2 à 3 jours.

| Axe | Note |
|---|---|
| 1. React 19 / TypeScript | **72** / 100 |
| 2. Tailwind / tokens | **58** / 100 |
| 3. Storybook | **76** / 100 |
| 4. Accessibilité | **64** / 100 |
| 5. Performance | **66** / 100 |
| 6. Build / packaging / DX | **55** / 100 |
| 7. Tests | **62** / 100 |
| **Global** | **65** / 100 |

> ### Suivi — mise à jour du 14 août 2026
>
> Les **12 quick wins du §11 ont été appliqués et vérifiés** (patch `quick-wins`, plus trois compléments décrits ci-dessous). Sont désormais **résolus** : A1-1, A1-9, A2-1, A2-2, A2-3, A3-1, A4-1, A4-2, A4-4, A4-6, A4-7, A6-2, A6-3.
>
> Vérifications exécutées : `pnpm type-check` ✅ · `pnpm build` ✅ · `pnpm build-storybook` ✅ · `pnpm test:storybook` → **99/99** ✅.
>
> Trois compléments non prévus par le patch :
> 1. **La barrière a11y a été testée armée**, pas seulement activée : une story de contrôle portant deux violations délibérées (`image-alt`, `button-name`) fait bien échouer la suite via l'`afterEach` de `@storybook/addon-a11y` (axe-core 4.13). Elle a été supprimée après vérification. Aucune dérogation `test: 'todo'` par composant ne s'est révélée nécessaire : les P1 restants de l'axe 4 (A4-3, A4-8, A4-9) ne correspondent à aucune règle axe automatisable, ce qui **confirme qu'ils devront être vérifiés à la main**.
> 2. `pnpm-lock.yaml` a été resynchronisé avec les 5 versions figées (aucune montée de version, seuls les `specifier:` changent) — `--frozen-lockfile` repasse.
> 3. **A4-6 est passé de « partiel » à « résolu »** : les règles `prefers-reduced-motion` ont été déplacées de `src/index.css` (non publié) vers un plugin `addBase` du preset ([tailwind-preset.ts:12-23](src/tailwind-preset.ts#L12-L23)), donc héritées par toute application appliquant le preset. Conséquence : `tailwindcss` devient un **peer dependency optionnel** ([package.json:50-56](package.json#L50-L56)), et `tailwindcss/plugin` reste externe au bundle (vérifié dans `dist/tailwind-preset.mjs`). À reporter dans l'arbitrage 3 : ce plugin est une contrainte de plus lors du passage en `@theme` CSS v4.
>
> Reste ouvert et prioritaire : **A6-1 (`"use client"`, P0)**, A5-1, A6-7 (CI), A7-1, et les 7 findings a11y non automatisables.

**Écarts constatés vs. le contexte fourni** — aucun sur les versions (React 19.2.8, TS 7.0.2, Tailwind 3.4.19, Storybook 10.5.8, lucide-react 1.31.0, tailwind-merge 3.6.0, Vitest 4.1.10, Playwright 1.62.1 : tous conformes). Deux précisions : `src/lib/` contient 7 modules et non 6 (`focus-ring`, `focus-trap`, `cn`, `design-tokens`, `heading`, `score-tier`, `semantic-colors`), et le repo ne contient **ni CI, ni LICENSE**, non mentionnés dans le contexte.

---

## 2. Tableau des findings priorisés

| ID | Axe | Sév. | Fichier:ligne | Problème | Correctif proposé |
|---|---|---|---|---|---|
| A6-1 | Build | **P0** | `package.json:5-19`, tous les composants | Aucune directive `"use client"` : le package casse en Next.js App Router | Bannière tsup `"use client"` + `esbuildOptions` |
| A1-1 | React/TS | **P1** | `src/components/Dropzone/Dropzone.tsx:44-53,204` | `multiple`, `file`, `files`, `onFileSelect`, `onFilesSelect` fuient dans `...rest` et sont spreadés sur le `<div>` | Extraire ces clés du `rest` |
| A2-1 | Tailwind | **P1** | `src/lib/design-tokens.ts:10-15` | `ai-200` utilisé 4× mais absent de la palette → `.border-ai-200` absent du CSS compilé | Ajouter les paliers 100–900 aux échelles `brand` et `ai` |
| A2-2 | Tailwind | **P1** | `tailwind.config.ts:6` | `content` n'inclut pas `.mdx` → classes des pages docs purgées | Ajouter `./src/**/*.mdx` et `./.storybook/**/*.{ts,tsx}` |
| A3-1 | Storybook | **P1** | `.storybook/preview.ts:40-42` | `a11y.test: 'todo'` → aucune violation ne fait échouer un test | Passer à `'error'` |
| A4-1 | A11y | **P1** | `src/components/ScoreGauge/ScoreGauge.tsx:90-96` | Jauge en `role="img"`, sans `aria-valuenow` | `role="meter"` + `aria-valuenow/min/max/valuetext` |
| A4-2 | A11y | **P1** | `ToastProvider.tsx:113-121` + `Toast.tsx:41-43` | Live regions imbriquées (viewport `aria-live` + toast `role="status"`) | Retirer `aria-live` du conteneur |
| A4-3 | A11y | **P1** | `src/components/Card/Card.tsx:113-118` | `aria-labelledby` sur un `div` sans rôle → ignoré par les AT | Rendre `<section>` quand `ariaLabelledBy` est défini |
| A4-4 | A11y | **P1** | `src/components/PricingCard/PricingCard.tsx:88-101` | Fonctionnalité exclue signalée seulement par `line-through` (visuel) | Texte alternatif `sr-only` « Non inclus » |
| A4-6 | A11y | **P1** | `src/index.css:1-3` | Aucun support `prefers-reduced-motion` (spinners, pulse, transitions 500-1000 ms) | Bloc `@media (prefers-reduced-motion: reduce)` en `@layer base` |
| A4-7 | A11y | **P1** | `src/components/UsageBar/UsageBar.tsx:75-84` | Cible tactile ≈ 16 px de haut < 24×24 (WCAG 2.2 SC 2.5.8 AA) | `min-h-6 px-2 -mx-2` |
| A4-9 | A11y | **P1** | `src/components/Dropzone/Dropzone.tsx:191-193,205-217` | `focusRing` posé sur le `<label>` alors que le focus va à l'`<input class="sr-only">` → anneau jamais visible | `peer` + `peer-focus-visible:` sur le label |
| A5-1 | Perf | **P1** | `tsup.config.ts:6-8`, `dist/index.mjs` | Bundle monolithique 53,4 Ko ESM, `splitting: false`, entrée unique | `splitting: true` + entrées par composant |
| A6-2 | Build | **P1** | `package.json:63,67-71` | 5 dépendances en `latest` → builds non reproductibles | Figer les versions installées |
| A6-3 | Build | **P1** | `package.json:20-22` | `sideEffects` absent → tree-shaking non garanti | `"sideEffects": false` |
| A6-7 | Build | **P1** | *(aucun `.github/`)* | Aucune CI : rien ne rejoue `build`, `type-check`, `test:storybook` | Workflow GitHub Actions |
| A7-1 | Tests | **P1** | `vitest.config.ts:11-31` | Un seul projet (`storybook`) : `src/lib/` n'a aucun test unitaire | 2ᵉ projet Vitest `unit` (node/jsdom) |
| A1-2 | React/TS | P2 | `Textarea.tsx:37-50` | `useEffect` de synchronisation `value → length` superflu | Dériver la longueur au rendu |
| A1-3 | React/TS | P2 | `DataTable.tsx:150-152` | Cast générique qui écrase le type `forwardRef` et supprime `displayName` | Ref-as-prop React 19 (voir arbitrage §9) |
| A1-4 | React/TS | P2 | `Card.tsx:39-43,101-102` | Enregistrement du `titleId` par contexte + effet → rendu supplémentaire | Voir arbitrage §9 (2 options) |
| A1-5 | React/TS | P2 | `Modal.tsx:141-148` | Callback ref recréée à chaque rendu → détach/rattach systématique | `useCallback` ou helper `mergeRefs` |
| A1-6 | React/TS | P2 | `Button.tsx:15` *(et 12 autres)* | `forwardRef` partout alors que React 19 accepte `ref` en prop | Voir arbitrage §9 (peer React 18) |
| A1-7 | React/TS | P2 | `ToastProvider.tsx:81-108` | `useCallback`/`useMemo` manuels rendus redondants par React Compiler | Adopter le compilateur, puis retirer |
| A1-8 | React/TS | P2 | 13 composants, ligne 1 | `import React from 'react'` inutile avec `jsx: react-jsx` | `import type React` + imports nommés |
| A1-9 | React/TS | P2 | `UsageBar.tsx:35` | `max = 0` → `aria-valuenow={NaN}` et `width: NaN%` | Garde sur `max <= 0` |
| A2-3 | Tailwind | P2 | `src/docs/Introduction.mdx:71,81,…` | `brand-200` / `brand-300` référencés mais absents de la palette | Idem A2-1 |
| A2-4 | Tailwind | P2 | `design-tokens.ts:50-53` | `borderRadius.xl/2xl` identiques aux valeurs Tailwind par défaut | Supprimer ou différencier |
| A2-5 | Tailwind | P2 | `src/tailwind-preset.ts:4-12` | Le preset n'expose ni `content`, ni typo/espacements | Ajouter `content` + `fontFamily` |
| A2-6 | Tailwind | P2 | `PricingCard.tsx:76`, `ScoreGauge.tsx:128`, … | 7 valeurs arbitraires non tokenisées (`text-[11px]`, `top-[34px]`…) | Tokens `fontSize.2xs`, etc. |
| A2-7 | Tailwind | P2 | `src/lib/cn.ts:5` | `twMerge` non étendu : `shadow-card` et `text-semantic-*` hors class groups | `extendTailwindMerge` |
| A2-8 | Tailwind | P2 | `postcss.config.js`, `src/index.css` | Reste en v3.4 alors que v4.3 est la version stable | Migration cadrée §10 |
| A3-2 | Storybook | P2 | `Input.stories.tsx:1-90` | Aucun `play`, aucun `argTypes` | Ajouter test label/erreur |
| A3-3 | Storybook | P2 | `ScoreGauge.stories.tsx:28-70` | Pas de story sur les bornes (0, 100, hors plage) | Stories `ZeroScore`, `OutOfRange` |
| A3-4 | Storybook | P2 | `.storybook/preview.ts:37-39` | 4 viewports définis, utilisés uniquement par les 2 templates | Stories mobiles sur Modal/DataTable/Dropzone |
| A3-5 | Storybook | P2 | `.storybook/main.ts:10` | `@chromatic-com/storybook` chargé mais aucun paramètre `chromatic` | Configurer ou retirer |
| A3-6 | Storybook | P2 | `Modal/Card/DataTable/PricingCard.stories.tsx` | Pas d'`argTypes` → contrôles inférés uniquement |  Documenter les unions |
| A3-7 | Storybook | P2 | `.storybook/main.ts:19-21` | `docs.defaultName: 'Documentation'` → IDs `--documentation`, piège à liens 404 | Documenter dans le README |
| A4-5 | A11y | P2 | `RoleToggle.tsx:31-45` | Radiogroup sans `Home`/`End` (APG) | Ajouter les 2 touches |
| A4-8 | A11y | P2 | `DataTable.tsx:60,109-145` | Pas de nom accessible, pas de tri (`aria-sort`), changement de page non annoncé | `<caption>` + live region |
| A4-10 | A11y | P2 | `focus-trap.ts:32` | Élément focalisé choisi via la chaîne FR `aria-label="Fermer la fenêtre"` | `data-autofocus` |
| A4-11 | A11y | P2 | `Modal.tsx:152-169` | `inert` figé à l'ouverture, `body.style.overflow` écrasé sans compteur | Registre de modales |
| A4-12 | A11y | P2 | `Textarea.tsx:94` | Compteur `aria-live="polite"` à chaque frappe | Annonce aux seuils |
| A5-2 | Perf | P2 | `Button.tsx:31-49` | 5 `cn()` (clsx + twMerge) calculés par rendu, 1 seul utilisé | Hisser les maps au module |
| A5-3 | Perf | P2 | `package.json:8-19` | Pas d'`exports` par sous-chemin | `"./button"`, `"./modal"`, … |
| A5-4 | Perf | P2 | `ScoreGauge.tsx:109` | `transition-all duration-1000` sur un `<circle>` SVG | `transition-[stroke-dashoffset]` |
| A5-5 | Perf | P2 | `DataTable.tsx:91-103` | Aucune virtualisation ni `React.memo` de ligne | Documenter la limite |
| A6-4 | Build | P2 | `tsconfig.build.json:9`, `tsup.config.ts:9` | `declarationMap`/`sourcemap` pointent `../src`, non publié (`files: ["dist"]`) | Publier `src` ou désactiver |
| A6-5 | Build | P2 | `package.json:39` | `license: MIT` sans fichier LICENSE ; pas de `repository`/`homepage` | Ajouter les champs |
| A6-6 | Build | P2 | `tsup.config.ts:4-13` | Ni `target` ni `platform: 'browser'` explicites | Fixer `es2020` / `browser` |
| A6-8 | Build | P2 | `package.json:8-19` | Aucun export CSS ni doc du glob `content` côté consommateur | Documenter dans le README |
| A7-2 | Tests | P2 | `vitest.config.ts` | `@vitest/coverage-v8` installé sans configuration ni seuil | `coverage.thresholds` |
| A7-3 | Tests | P2 | `Badge.stories.tsx:92-100` | `play` limité à des `getByText` (assertion faible) | Assertions de rôle/état |
| A7-4 | Tests | P2 | `Modal.stories.tsx:146-165` | Le piège est testé, pas la **restitution** du focus après fermeture | Story `FocusRestoration` |
| A7-5 | Tests | P2 | *(aucun `.github/`)* | Aucune non-régression visuelle automatisée | Chromatic ou snapshots |

---

## 3. Axe 1 — React 19 / TypeScript

### A1-1 (P1) — Props non-DOM spreadées sur le `<div>` racine du Dropzone

`Dropzone.tsx:44-53` ne retire de `props` que 6 clés ; `multiple`, `onFileSelect`, `onFilesSelect`, `file` et `files` restent dans `...rest`, qui est spreadé sur le `<div>` ligne 204. React DOM émet un avertissement par prop inconnue (`Warning: React does not recognize the onFileSelect prop on a DOM element`) et sérialise `file` en `[object File]` dans le HTML.

```tsx
// AVANT — Dropzone.tsx:45-53
const {
  onClear, accept = '.pdf', maxSizeMB = 5,
  isDisabled = false, isLoading = false, className,
  ...rest                       // ← contient encore multiple, file, files, onFileSelect…
} = props;

// APRÈS
const {
  onClear, accept = '.pdf', maxSizeMB = 5,
  isDisabled = false, isLoading = false, className,
  multiple: _multiple,
  onFileSelect: _onFileSelect,
  onFilesSelect: _onFilesSelect,
  file: _file,
  files: _files,
  ...rest                       // ← uniquement des attributs HTML valides
} = props as DropzoneBaseProps & Record<string, unknown>;
```

> Note connexe : l'indentation de `Dropzone.tsx:60-319` a dérivé d'un niveau lors d'un refactor précédent (le corps est indenté comme s'il était encore dans le callback `forwardRef`). Purement cosmétique, mais bruyant en revue.

### A1-2 (P2) — Effet de synchronisation superflu dans Textarea

```tsx
// AVANT — Textarea.tsx:37-50
const [length, setLength] = React.useState(() => { /* … */ });
React.useEffect(() => {
  if (typeof value === 'string') setLength(value.length);
}, [value]);

// APRÈS — état local uniquement pour le mode non contrôlé
const [uncontrolledLength, setUncontrolledLength] = React.useState(
  () => (typeof defaultValue === 'string' ? defaultValue.length : 0)
);
const length = typeof value === 'string' ? value.length : uncontrolledLength;
```

Un rendu de moins par frappe en mode contrôlé, et le compteur ne peut plus désynchroniser.

### A1-3 (P2) — Le cast générique de DataTable écrase le type `forwardRef`

`DataTable.tsx:150-152` caste vers `<T>(props) => ReactElement | null`. Conséquences : `DataTable.displayName` n'est jamais posé (il n'existe pas sur ce type), et l'objet perd sa nature `ForwardRefExoticComponent`. Sous React 19, `ref` étant une prop normale, le cast disparaît :

```tsx
// AVANT
export const DataTable = React.forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;

// APRÈS (React 19 uniquement — voir arbitrage §9)
export function DataTable<T>({ ref, ...props }: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }) { /* … */ }
DataTable.displayName = 'DataTable';
```

### A1-4 (P2) — Card : enregistrement du titre par contexte + effet

`CardHeader` (`Card.tsx:39-43`) remonte son `titleId` au `Card` via un contexte et un `useEffect`, ce qui provoque un second rendu du `Card` après montage et ne gère qu'un seul header. Deux corrections valides s'opposent — voir **§9 Arbitrages**.

### A1-5 (P2) — Callback ref instable dans Modal

```tsx
// AVANT — Modal.tsx:141-148 : nouvelle fonction à chaque rendu
const setDialogRef = (node: HTMLDivElement | null) => { /* … */ };

// APRÈS
const setDialogRef = React.useCallback((node: HTMLDivElement | null) => {
  dialogRef.current = node;
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}, [ref]);
```

Sans cela React appelle la ref avec `null` puis avec le nœud à chaque rendu de la modale.

### A1-6 (P2) — `forwardRef` généralisé

13 composants utilisent `React.forwardRef` alors que React 19 accepte `ref` comme prop ordinaire. Le `peerDependencies` autorisant `^18.0.0` (`package.json:47`), la suppression est une décision d'architecture — voir **§9**.

### A1-7 (P2) — Mémoïsation manuelle, éligibilité React Compiler

`ToastProvider.tsx:81-108` empile `useCallback` ×3 et `useMemo` ×1. La doc React confirme que **React Compiler supprime le besoin de `useMemo`, `useCallback` et `React.memo`** ; il est installé via `babel-plugin-react-compiler@latest` + `eslint-plugin-react-hooks@latest`, fonctionne au mieux avec **React 19** (17 et 18 supportés). Le code de la librairie est globalement compatible (pas de mutation en cours de rendu détectée) ; `ToastProvider` est le premier candidat au nettoyage une fois le compilateur activé.

### A1-8 (P2) — Import React par défaut inutile

Les 13 composants ouvrent par `import React from 'react'` alors que `tsconfig.json:14` fixe `"jsx": "react-jsx"`. Pour les fichiers qui n'utilisent React que pour ses types (`ScoreGauge.tsx:1`, `Badge.tsx:1`), `import type React from 'react'` suffit et allège le graphe.

### A1-9 (P2) — Division par zéro dans UsageBar

```tsx
// AVANT — UsageBar.tsx:35 : max = 0 → NaN
const percentage = Math.min(Math.max(Math.round((current / max) * 100), 0), 100);

// APRÈS
const percentage = max > 0
  ? Math.min(Math.max(Math.round((current / max) * 100), 0), 100)
  : 0;
```

Avec `max = 0`, `aria-valuenow={NaN}` et `style={{ width: 'NaN%' }}` sont rendus tels quels.

✅ **Axe 1 — React 19 / TypeScript — 9 findings** (1 P1, 8 P2)

---

## 4. Axe 2 — Tailwind, preset et design tokens

### A2-1 (P1) — `ai-200` référencé mais absent de la palette

`design-tokens.ts:10-15` définit l'échelle `ai` avec **50, 500, 600, 700** uniquement. Or `ai-200` est utilisé 4 fois :

| Fichier:ligne | Classe |
|---|---|
| `src/components/Badge/Badge.tsx:33` | `border-ai-200/60` |
| `src/components/Card/Card.tsx:107` | `border border-ai-200/70` |
| `src/components/ScoreGauge/ScoreGauge.tsx:48` | `border-ai-200` |
| `src/lib/semantic-colors.ts:28` | `border-ai-200` |

**Preuve** : `grep -c '\.border-ai-200' storybook-static/assets/iframe-DFjEZYjb.css` renvoie **0**, alors que les classes de contrôle `.bg-ai-50`, `.text-ai-700`, `.shadow-card` et `.text-semantic-muted` sont bien présentes. Les quatre composants portent donc `border` sans couleur et retombent sur `borderColor.DEFAULT` du preflight.

```ts
// AVANT — design-tokens.ts:10-15
ai: { 50: '#f5f3ff', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },

// APRÈS — échelle complète, mêmes ancres
ai: {
  50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
  500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95',
},
```

### A2-2 (P1) — Les fichiers `.mdx` ne sont pas dans `content`

```ts
// AVANT — tailwind.config.ts:6
content: ['./src/**/*.{js,ts,jsx,tsx}'],

// APRÈS
content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './.storybook/**/*.{ts,tsx}'],
```

**Preuve** : `shadow-xs` est défini dans le preset (`design-tokens.ts:55`) et utilisé uniquement dans `src/docs/Introduction.mdx:16-19`. La classe `.shadow-xs` est **absente** du CSS compilé. Toutes les classes exclusives aux pages de doc sont donc silencieusement purgées.

### A2-3 (P2) — `brand-200` / `brand-300` inexistants

L'échelle `brand` s'arrête à 50, 100, 500, 600, 700 (`design-tokens.ts:3-9`), mais `Introduction.mdx` utilise `hover:border-brand-300` (6×) et `decoration-brand-200` (15×). `.border-brand-300` et `.decoration-brand-200` sont absentes du CSS compilé. Corrigé par A2-1 (compléter l'échelle) — c'est le correctif à privilégier, l'alternative étant de rabattre ces classes sur `brand-500/10`.

### A2-4 (P2) — Tokens de rayon morts

```ts
// design-tokens.ts:50-53 — identiques aux valeurs Tailwind v3 par défaut
borderRadius: { xl: '0.75rem', '2xl': '1rem' },
```

Ces deux entrées écrasent les défauts avec les défauts. Soit les différencier (rayon maison), soit les supprimer du preset — dans les deux cas, le message « le preset porte les rayons » devient exact.

### A2-5 (P2) — Le preset ne couvre que couleurs, rayons et ombres

`tailwind-preset.ts:4-12` n'expose ni `content`, ni `fontFamily`, ni échelle d'espacement. Un consommateur qui applique le preset doit encore deviner le glob `./node_modules/@aquellec/ui/dist/**/*.{js,mjs}` (aujourd'hui documenté seulement dans `Introduction.mdx:136-137`). Le preset peut porter ce glob lui-même.

### A2-6 (P2) — Valeurs arbitraires non tokenisées

`text-[11px]` (11 occurrences), `text-[10px]` (`ScoreGauge.tsx:33`), `min-h-[32px]` (`PricingCard.tsx:76`), `max-w-[80%]` (`ScoreGauge.tsx:128`), `scale-[0.99]` (`Dropzone.tsx:196`), `max-h-[90vh]` (`Modal.tsx:196`), `top-[34px]` (`Input.stories.tsx:67,85`). Un token `fontSize['2xs']` dans le preset supprimerait à lui seul 12 de ces occurrences.

### A2-7 (P2) — `twMerge` non étendu aux classes maison

```ts
// AVANT — src/lib/cn.ts:5
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// APRÈS
import { extendTailwindMerge } from 'tailwind-merge';
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['xs', 'card', 'overlay'] }],
    },
  },
});
```

Sans cela `cn('shadow-card', 'shadow-md')` conserve **les deux** classes (`shadow-card` n'appartient à aucun class group connu), et un `className` passé par le consommateur ne peut pas écraser l'ombre du composant. Même logique pour les couleurs `semantic-*` imbriquées.

### A2-8 (P2) — Migration Tailwind v3.4 → v4

Version stable actuelle confirmée sur la doc officielle : **Tailwind CSS v4.3**. Chantier cadré en §10. Points d'attention propres à ce repo :

- `@tailwind base/components/utilities` (`src/index.css:1-3`) → `@import "tailwindcss"`.
- `postcss.config.js` → `@tailwindcss/postcss`, et `autoprefixer` devient inutile (à retirer des devDependencies).
- Storybook utilisant Vite, le plugin `@tailwindcss/vite` remplace la chaîne PostCSS.
- **Renommages impactants** : `shadow-sm` → `shadow-xs` et `shadow` → `shadow-sm` — `shadow-sm` apparaît dans 9 composants ; `outline-none` → `outline-hidden` touche les 3 constantes de `focus-ring.ts`; `ring` → `ring-3` touche `PricingCard.tsx:61`.
- Prérequis navigateurs v4 : **Safari 16.4+, Chrome 111+, Firefox 128+** — à valider avec la cible produit avant tout engagement.
- `npx @tailwindcss/upgrade` automatise l'essentiel ; le preset TS devra être reporté en `@theme` CSS, ce qui **remet en cause l'export `./tailwind-preset`** (voir §9).

✅ **Axe 2 — Tailwind — 8 findings** (2 P1, 6 P2)

---

## 5. Axe 3 — Storybook

Couverture actuelle : **17 entrées** (13 composants + 2 templates + 2 pages MDX), **110 stories**, dont **27 avec `play`**. C'est au-dessus de la moyenne des design systems de cette taille ; les manques sont ciblés.

### A3-1 (P1) — Les tests d'accessibilité ne peuvent pas échouer

```ts
// AVANT — .storybook/preview.ts:40-42
a11y: { test: 'todo' },

// APRÈS
a11y: { test: 'error' },
```

La doc Storybook est explicite : `'todo'` = « violations return a **warning** in the Storybook UI », `'error'` = « violations return a **failing test** in the Storybook UI and CLI/CI ». Tel quel, `pnpm test:storybook` ne peut jamais échouer pour une régression d'accessibilité — l'addon `a11y` est décoratif. Migration recommandée : passer `'error'` globalement, et poser `a11y: { test: 'todo' }` au niveau des composants dont les violations connues (A4-*) ne sont pas encore corrigées, pour ne pas bloquer la CI dès le premier jour.

### A3-2 (P2) — Input est le seul composant sans test ni `argTypes`

`Input.stories.tsx` compte 6 stories, aucun `play`, aucun `argTypes`. C'est pourtant le composant où la liaison `label`/`htmlFor`/`aria-describedby` (`Input.tsx:19-38`) mérite un verrou :

```tsx
export const WithError: Story = {
  args: { /* … */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText('Titre du poste');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription('Le titre du poste est requis.');
  },
};
```

### A3-3 (P2) — Cas limites absents

`ScoreGauge.stories.tsx:28-70` couvre 75/50/<50 et le thème IA, mais ni `score={0}`, ni `score={100}`, ni les valeurs hors plage que `ScoreGauge.tsx:30` prend soin de normaliser. Même constat pour `UsageBar` (`max=0`, cf. A1-9) et `DataTable` (colonne sans `accessorKey` **et** sans `cell`, qui rend `null` en `DataTable.tsx:99`).

### A3-4 (P2) — Viewports définis mais quasi inutilisés

`.storybook/preview.ts:5-26` déclare 4 viewports ; seuls `CandidateDashboard.stories.tsx:286` et `RecruiterDashboard.stories.tsx:177` les exploitent via `globals`. Aucun composant n'est vérifié en 375 px, alors que `Modal` (`max-h-[90vh]`), `DataTable` (`overflow-x-auto`) et `Dropzone` sont les plus exposés.

### A3-5 (P2) — Addon Chromatic inerte

`@chromatic-com/storybook@5.3.0` est chargé (`.storybook/main.ts:10`) mais aucun paramètre `chromatic` n'existe dans le repo, et aucune CI ne l'appelle (A6-7). Soit brancher le service, soit retirer l'addon du build.

### A3-6 (P2) — `argTypes` manquants sur les APIs riches

`Badge`, `Button`, `Card`, `Dropzone`, `ScoreGauge`, `Toast` et `UsageBar` déclarent des `argTypes` ; `Modal`, `DataTable` et `PricingCard` n'en ont pas. Ce sont pourtant ceux dont les props sont les moins devinables (`maxWidth`, `titleAs`, `labelledBy`, `pagination`, union `PricingFeature[]`).

### A3-7 (P2) — Le piège des IDs `--documentation`

`.storybook/main.ts:19-21` fixe `docs.defaultName: 'Documentation'`, donc chaque page autodocs a l'ID `<titre-kebab>--documentation` et non `--docs`. C'est la cause du 404 « Couldn't find story matching » corrigé dans `Introduction.mdx`. À documenter dans le README pour que la prochaine page MDX ne retombe pas dedans.

✅ **Axe 3 — Storybook — 7 findings** (1 P1, 6 P2)

---

## 6. Axe 4 — Accessibilité (WCAG 2.2 AA + WAI-ARIA APG)

### A4-1 (P1) — ScoreGauge : `role="img"` au lieu d'un compteur

La doc APG du pattern *meter* impose `role="meter"` avec `aria-valuenow`, `aria-valuemin`, `aria-valuemax` et un nom accessible ; `aria-valuetext` sert quand le pourcentage seul n'est pas parlant. Elle distingue explicitement le *meter* (valeur dans une plage) du *progressbar* (avancement d'une tâche) — un score ATS est un *meter*.

```tsx
// AVANT — ScoreGauge.tsx:90-96
<svg width={width} height={width} className="transform -rotate-90" role="img" aria-label={gaugeLabel}>

// APRÈS
<svg
  width={width} height={width} className="transform -rotate-90"
  role="meter"
  aria-valuenow={normalizedScore}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuetext={gaugeLabel}
  aria-label={label}
>
```

En l'état, une valeur qui change n'est pas exposée comme une valeur : le lecteur d'écran relit une image dont l'`aria-label` a muté.

### A4-2 (P1) — Toast : live regions imbriquées

`ToastProvider.tsx:113-121` pose `role="region"` **et** `aria-live="polite"` sur le viewport, tandis que chaque `Toast` porte déjà `role="status"`/`role="alert"` + `aria-live` (`Toast.tsx:41-43`). Deux live regions emboîtées produisent selon les moteurs une double annonce ou aucune, et le `aria-live="polite"` du conteneur écrase la politesse `assertive` des toasts d'erreur.

```tsx
// AVANT — ToastProvider.tsx:113-117
<div role="region" aria-label="Notifications" aria-live="polite" className={…}>

// APRÈS — le conteneur nomme, les enfants annoncent
<div role="region" aria-label="Notifications" className={…}>
```

### A4-3 (P1) — Card : `aria-labelledby` sur un `div` sans rôle

`Card.tsx:113-118` applique `aria-labelledby` à un `<div>` de rôle implicite `generic`. La spécification ARIA interdit le calcul du nom accessible sur `role="generic"` : l'attribut est purement décoratif aujourd'hui, et toute la mécanique contexte + effet de `CardHeader` (`Card.tsx:39-43`) est sans effet perceptible.

```tsx
// APRÈS — un élément nommable seulement quand il y a un nom
const Tag = ariaLabelledBy ? 'section' : 'div';
<Tag ref={ref} aria-labelledby={ariaLabelledBy} className={…} {...props}>
```

### A4-4 (P1) — PricingCard : exclusion signalée uniquement par le visuel

`PricingCard.tsx:88-101` : une fonctionnalité non incluse se distingue par `line-through` + une pastille grise, avec l'icône `aria-hidden`. Un lecteur d'écran entend exactement le même texte pour « inclus » et « non inclus » — WCAG 1.3.1 (Info et relations) et 1.4.1 (Utilisation de la couleur).

```tsx
// APRÈS
<li key={feature.text} className="flex items-start text-xs">
  <span className="sr-only">{feature.included ? 'Inclus : ' : 'Non inclus : '}</span>
  {/* … */}
</li>
```

### A4-5 (P2) — RoleToggle : radiogroup sans `Home`/`End`

`RoleToggle.tsx:31-45` gère les 4 flèches avec un roving tabindex correct (`tabIndex` ligne 64/83) et `aria-checked` — conforme au pattern *radio group* de l'APG, à l'exception de `Home` (premier bouton) et `End` (dernier), attendus par le pattern.

### A4-6 (P1) — Aucun support de `prefers-reduced-motion`

`src/index.css:1-3` ne contient que les trois directives Tailwind. Les animations concernées : `animate-spin` (`Button.tsx:71`, `Dropzone.tsx:251,282`), `animate-pulse` (`DataTable.tsx:73`), `transition-all duration-1000` (`ScoreGauge.tsx:109`), `duration-500` (`UsageBar.tsx:65`), `duration-200/150` (~15 occurrences).

```css
/* APRÈS — src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

Attention : ce fichier n'est **pas** publié dans `dist` (`files: ["dist"]`, cf. A6-8). Le correctif doit donc aussi être poussé côté preset ou documenté, sinon il ne protège que Storybook.

### A4-7 (P1) — Cible tactile sous 24×24 px (WCAG 2.2 SC 2.5.8, AA)

`UsageBar.tsx:75-84` : le bouton « Passer à la version Pro → » n'a ni hauteur ni padding — `text-xs` donne une boîte d'environ 16 px de haut. Le critère exige **24 × 24 px CSS**, avec des exceptions (inline dans un bloc de texte, espacement équivalent, taille essentielle) dont aucune ne s'applique ici : c'est un bouton isolé dans une barre d'action.

```tsx
// APRÈS
className={cn(
  'inline-flex min-h-6 items-center px-2 -mx-2 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors',
  focusRingGhost
)}
```

Contrôles vérifiés conformes : fermeture Toast (`p-1` + 16 px = 24 px, `Toast.tsx:60`), fermeture Modal (28 px, `Modal.tsx:68`), pagination DataTable (~26 px, `DataTable.tsx:123`), suppression Dropzone (28 px, `Dropzone.tsx:259`).

### A4-8 (P2) — DataTable : nom, tri et pagination non annoncés

`DataTable.tsx:60` produit un `<table>` sans `<caption>` ni `aria-label` : dans la liste des tableaux d'un lecteur d'écran, il apparaît sans nom. `aria-busy` (ligne 60) couvre le chargement, mais rien n'annonce un changement de page (`onPageChange`, lignes 121/133). Enfin l'API `Column<T>` (lignes 7-16) n'offre aucun tri, alors que le contexte produit (matching ATS) l'appelle — quand il arrivera, `aria-sort` sur le `<th scope="col">` sera obligatoire.

### A4-9 (P1) — Dropzone : l'anneau de focus n'apparaît jamais

`Dropzone.tsx:191-193` applique `focusRing` (`focus-visible:ring-2`) sur la **surface**, qui est un `<label>` (ligne 271) — un `<label>` n'est pas focusable. Le focus va à l'`<input type="file" class="sr-only">` (lignes 205-217). Le style ne se déclenche donc jamais : la zone de dépôt est **invisible au clavier** alors que la story `KeyboardInteraction` (`Dropzone.stories.tsx:169`) valide bien son activation.

```tsx
// APRÈS — l'input pilote le style du label
<input ref={inputRef} id={inputId} type="file" /* … */ className="sr-only peer" />
…
const dropzoneSurfaceClassName = cn(
  'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
  /* … */
);
```

(La règle CSS `peer` exige que l'input soit un frère précédent du label : c'est déjà le cas.)

### A4-10 (P2) — Focus trap couplé à une chaîne française

```ts
// focus-trap.ts:32
const closeButton = container.querySelector<HTMLElement>('[aria-label="Fermer la fenêtre"]');
```

Un utilitaire générique dépend ici du libellé exact d'un bouton : toute traduction ou reformulation casse silencieusement le focus initial. Un `[data-autofocus]` posé par `ModalHeader` découple les deux. Accessoirement, l'APG recommande de focaliser l'élément le plus utile à l'ouverture — souvent le premier contrôle, pas la fermeture.

### A4-11 (P2) — Modal : `inert` figé, `overflow` non compté

`Modal.tsx:152-169` capture les frères de `document.body` **une seule fois** à l'ouverture : un portail monté ensuite (une seconde modale, un toast viewport) reste accessible aux AT. Et `document.body.style.overflow = ''` au démontage réactive le scroll même si une autre modale est encore ouverte. Un compteur de modales partagé règle les deux.

### A4-12 (P2) — Compteur de caractères trop bavard

`Textarea.tsx:94` porte `aria-live="polite"` sur le compteur, réannoncé à chaque frappe. Recommandation courante : n'annoncer qu'aux seuils (80 %, 100 %), ou déplacer l'information dans `aria-describedby`.

> **Non vérifié** : les ratios de contraste ne sont pas mesurés ici (audit statique). Les commentaires de `semantic-colors.ts:1-20` annoncent une conformité AA 4.5:1 — `[à vérifier]` avec l'addon a11y une fois A3-1 passé en `'error'`.

✅ **Axe 4 — Accessibilité — 12 findings** (7 P1, 5 P2)

---

## 7. Axe 5 — Performance

Mesures relevées sur le `dist/` présent dans le workspace (build antérieur, non relancé) :

| Artefact | Taille |
|---|---|
| `dist/index.mjs` (ESM, toute la librairie) | **53,4 Ko** |
| `dist/index.js` (CJS) | 56,7 Ko |
| `dist/tailwind-preset.mjs` | 1,5 Ko |
| `storybook-static/assets/iframe-*.css` | 25 Ko |

Point positif confirmé : `clsx`, `tailwind-merge`, `react`, `react-dom` et `lucide-react` restent **externes** dans le bundle (imports préservés en tête de `dist/index.mjs`) — aucune duplication chez le consommateur. `lucide-react@1.31.0` déclare `sideEffects: false`, donc les imports nommés se tree-shakent correctement côté application.

### A5-1 (P1) — Bundle monolithique, pas de découpage

`tsup.config.ts:6-8` : une entrée unique et `splitting: false`. Importer `Button` fait entrer les 53,4 Ko dans le graphe ; seule une passe de tree-shaking du bundler applicatif peut les retirer — et elle est aujourd'hui empêchée par l'absence de `sideEffects` (A6-3). Correctif couplé :

```ts
// APRÈS — tsup.config.ts
entry: ['src/index.ts', 'src/components/*/index.ts'],
splitting: true,
```

### A5-2 (P2) — Objets de variantes reconstruits à chaque rendu

`Button.tsx:31-49` construit les **5** variantes à chaque rendu, chacune via `cn()` (donc `clsx` + `twMerge`), alors qu'une seule est utilisée. Même schéma pour `sizes` (ligne 51), `Badge.tsx:28-39`, `ScoreGauge.tsx:32-36`, `Card.tsx:104-109`, `Modal.tsx:173-178`.

```tsx
// APRÈS — hors composant, calculé une fois pour toute l'application
const BUTTON_VARIANTS = {
  primary: cn('bg-brand-600 text-white hover:bg-brand-700', focusRing),
  /* … */
} as const;
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => { /* … */ });
```

### A5-3 (P2) — Pas d'`exports` par sous-chemin

`package.json:8-19` n'expose que `.` et `./tailwind-preset`. Coupler A5-1 à des entrées `"./button"`, `"./modal"`… donne aux consommateurs sans tree-shaking (bundles legacy, Jest, SSR CJS) un chemin d'import minimal.

### A5-4 (P2) — `transition-all` sur un attribut SVG

`ScoreGauge.tsx:109` : `transition-all duration-1000` sur un `<circle>` fait surveiller au navigateur toutes les propriétés animables alors qu'une seule change. `transition-[stroke-dashoffset] duration-1000` cible l'unique propriété concernée (et se combine bien avec A4-6).

### A5-5 (P2) — DataTable sans virtualisation ni mémoïsation de ligne

`DataTable.tsx:91-103` rend l'intégralité de `data`, et chaque `col.cell(item)` est réexécuté à tout rendu du parent. C'est acceptable pour des pages paginées (usage prévu), mais la limite doit être **documentée** dans la doc du composant pour éviter un usage en liste de 5 000 lignes.

✅ **Axe 5 — Performance — 5 findings** (1 P1, 4 P2)

---

## 8. Axe 6 — Build, packaging et DX

### A6-1 (P0) — Aucune directive `"use client"`

Recherche exhaustive : **zéro occurrence** de `"use client"` dans `src/` comme dans `dist/`. Or 11 des 13 composants utilisent `useState`, `useId`, `useRef`, `useEffect` ou `createContext`. Dans une application Next.js App Router (cible naturelle d'un design system SaaS), tout import depuis un Server Component échoue au build : *« You're importing a component that needs useState. It only works in a Client Component. »* Le consommateur n'a aucun contournement propre autre que de réexporter chaque composant derrière son propre fichier `'use client'`.

```ts
// APRÈS — tsup.config.ts, entrée principale
{
  entry: ['src/index.ts', 'src/components/*/index.ts'],
  format: ['cjs', 'esm'],
  banner: { js: '"use client";' },
  external: ['react', 'react-dom', 'lucide-react'],
  /* … */
}
```

La bannière ne doit **pas** être appliquée à l'entrée `tailwind-preset` (code de configuration exécuté côté Node). C'est précisément pour cela que la config est déjà un tableau de deux objets : la bannière va sur le premier uniquement.

### A6-2 (P1) — Cinq dépendances épinglées sur `latest`

`package.json:63` (`@chromatic-com/storybook`), `:67` (`@storybook/addon-mcp`), `:68` (`vitest`), `:69` (`playwright`), `:70` (`@vitest/browser-playwright`), `:71` (`@vitest/coverage-v8`). Un `pnpm install` sur une machine neuve peut résoudre des versions différentes de celles du lockfile en cas de mise à jour du range — les versions réellement installées à ce jour sont : `vitest@4.1.10`, `playwright@1.62.1`, `@vitest/browser-playwright@4.1.10`, `@chromatic-com/storybook@5.3.0`, `@storybook/addon-mcp@0.7.0`. Les figer aligne le manifeste sur le lockfile et sur `pnpm-workspace.yaml`, qui épingle déjà finement les paquets Storybook via `minimumReleaseAgeExclude`.

### A6-3 (P1) — `sideEffects` absent du manifeste

```jsonc
// APRÈS — package.json, à côté de "files"
"sideEffects": false,
```

Sans ce drapeau, webpack et Rollup doivent supposer que l'import du barrel a des effets de bord et conservent le module entier. C'est le correctif à un mot qui débloque le tree-shaking des 53,4 Ko (A5-1). La librairie ne publiant aucun CSS, `false` est exact (pas besoin de la forme tableau).

### A6-4 (P2) — Sourcemaps et declaration maps orphelines

`tsconfig.build.json:9` active `declarationMap` et `tsup.config.ts:9` active `sourcemap`, mais `package.json:20-22` ne publie que `dist`. Vérification : `dist/index.d.ts.map` référence `sources: ["../src/index.ts"]`, chemin inexistant chez le consommateur — le « aller à la définition » atterrit dans le vide. Soit ajouter `"src"` à `files`, soit désactiver les deux options.

### A6-5 (P2) — Métadonnées de publication incomplètes

`package.json:39` déclare `"license": "MIT"` mais aucun fichier `LICENSE` n'existe à la racine — npm affichera la licence sans en fournir le texte. Manquent aussi `repository`, `homepage` et `bugs`, qui alimentent la page npm et les liens « source » des outils.

### A6-6 (P2) — tsup sans `target` ni `platform` explicites

`tsup.config.ts:4-13` laisse esbuild déduire sa cible du `tsconfig.json` racine (ES2020) et conserve la plateforme par défaut. Pour une librairie navigateur, expliciter `target: 'es2020'` et `platform: 'browser'` évite qu'un changement de `tsconfig` (fichier orienté typecheck, pas build) déplace silencieusement la cible de compilation.

### A6-7 (P1) — Aucune intégration continue

Pas de dossier `.github/`. Quatre scripts existent (`build`, `type-check`, `test:storybook`, `build-storybook`) et aucun n'est rejoué automatiquement. Toutes les corrections de cet audit sont réversibles au premier commit non vérifié tant que ce point n'est pas traité.

```yaml
# .github/workflows/ci.yml — squelette minimal
- run: pnpm install --frozen-lockfile
- run: pnpm type-check
- run: pnpm build
- run: pnpm playwright:install
- run: pnpm test:storybook
```

### A6-8 (P2) — Rien n'est documenté sur la CSS côté consommateur

La librairie ne publie pas de feuille de style (`src/index.css` n'est pas dans `dist`) : le consommateur **doit** appliquer le preset et inclure `./node_modules/@aquellec/ui/dist/**/*.{js,mjs}` dans son `content`. Cette contrainte n'apparaît que dans `Introduction.mdx:136-137` — elle doit figurer dans le README, à côté de la remarque sur `prefers-reduced-motion` (A4-6).

✅ **Axe 6 — Build / packaging / DX — 8 findings** (1 P0, 3 P1, 4 P2)

---

## 9. Axe 7 — Tests

État : **27 fonctions `play`** réparties sur 11 composants, exécutées par Vitest 4.1.10 en browser mode (Chromium via Playwright). `Dropzone` est exemplaire (14 stories de test couvrant contrôlé/non contrôlé, clavier, drag & drop, erreurs de taille et de type). `Modal` teste sérieusement le piège de focus (`Modal.stories.tsx:146-165`).

### A7-1 (P1) — `src/lib/` n'a aucun test unitaire

`vitest.config.ts:11-31` ne déclare qu'un projet, `storybook`. Les 7 modules de `src/lib/` ne sont donc testés qu'indirectement, à travers le rendu de composants. Les plus exposés sont de la logique pure, triviale à couvrir et coûteuse en régression :

- `score-tier.ts:2-6` — trois seuils (74/75, 49/50) jamais testés aux bornes.
- `heading.ts:6-14` — matrice `title` × `titleAs` × `defaultLevel`.
- `focus-trap.ts:7-11` — filtre `getFocusableElements` (le cas `offsetParent === null` échoue notamment sur les éléments `position: fixed`).
- `cn.ts:5` — le comportement de fusion, surtout une fois A2-7 appliqué.

```ts
// APRÈS — vitest.config.ts, second projet
{
  test: {
    name: 'unit',
    environment: 'node',
    include: ['src/lib/**/*.test.ts'],
  },
},
```

### A7-2 (P2) — Couverture installée mais non configurée

`@vitest/coverage-v8` est en devDependencies (`package.json:71`) sans aucune section `coverage` dans `vitest.config.ts` ni script associé. Aucun seuil ne protège donc les modules ci-dessus.

### A7-3 (P2) — Assertions faibles dans certaines `play`

`Badge.stories.tsx:92-100` se limite à cinq `getByText(...).toBeInTheDocument()`, ce qui passerait même si toutes les variantes rendaient le même style ou perdaient leur icône. Une assertion sur la classe de variante ou sur la présence de l'icône `aria-hidden` aurait une valeur de non-régression réelle.

### A7-4 (P2) — La restitution du focus n'est pas testée

`focus-trap.ts:83` restitue le focus à l'élément précédemment actif au démontage — comportement critique (WCAG 2.4.3) et non couvert : les cinq assertions `toHaveFocus` de `Modal.stories.tsx:151-163` portent toutes sur le cycle **à l'intérieur** de la modale ouverte. Une story qui ouvre, ferme, puis vérifie `expect(trigger).toHaveFocus()` manque.

### A7-5 (P2) — Pas de non-régression visuelle

Aucun snapshot, et l'addon Chromatic n'est pas branché (A3-5). Sur un design system dont la valeur est visuelle — et compte tenu des classes silencieusement inexistantes révélées en A2-1/A2-3 — c'est le filet le plus rentable à installer après la CI.

✅ **Axe 7 — Tests — 5 findings** (1 P1, 4 P2)

---

## 10. Arbitrages à trancher (impact architecture)

Trois décisions dépassent le correctif technique ; elles sont présentées sans recommandation tranchée.

### Arbitrage 1 — `forwardRef` vs. ref-as-prop React 19 (A1-3, A1-6)

| | Option A — conserver `forwardRef` | Option B — migrer en ref-as-prop |
|---|---|---|
| Compatibilité | React 18 **et** 19 (peer actuel `^18.0.0 \|\| ^19.0.0`) | React 19 uniquement → `peerDependencies` à restreindre, **major** |
| Code | Statu quo ; le cast de `DataTable.tsx:150` reste nécessaire | Supprime le cast, `displayName` fonctionne, génériques naturels |
| Coût | 0 | 13 composants + doc + note de version |

Le choix dépend d'une donnée hors code : **le parc d'applications consommatrices est-il déjà entièrement en React 19 ?**

### Arbitrage 2 — Nom accessible de Card (A1-4, A4-3)

- **Option A — `<section aria-labelledby>`** : conserve le mécanisme contexte/effet existant et le rend enfin effectif. Effet de bord : chaque `Card` nommée devient un *landmark* `region`, donc apparaît dans la liste des repères du lecteur d'écran — bruyant si une page affiche 12 cartes.
- **Option B — supprimer le mécanisme** : retirer contexte + effet + prop `labelledBy`, laisser le `<h2>` du header porter seul la sémantique. Plus simple, un rendu de moins, mais retire une capacité déjà exposée publiquement (`CardProps.labelledBy`, `Card.tsx:13`) → **breaking change**.

### Arbitrage 3 — Devenir de l'export `./tailwind-preset` en Tailwind v4 (A2-8)

La v4 configure le thème en CSS via `@theme`. Deux voies :

- **Option A — préset CSS** : publier un `dist/theme.css` importé par `@import "@aquellec/ui/theme.css"`. Idiomatique v4, mais **casse** l'API publique `presets: [require('@aquellec/ui/tailwind-preset')]` documentée dans `Introduction.mdx:134`.
- **Option B — double publication** : garder l'export JS (v4 accepte encore `@config`) et ajouter l'export CSS. Aucune rupture, au prix de deux sources de vérité pour les tokens.

---

## 11. Quick wins (< 15 min chacun)

> ✅ **Les 12 sont appliqués et vérifiés depuis le 14 août 2026** — voir le bloc *Suivi* du §1. Le tableau ci-dessous est conservé comme trace de l'état initial.

| # | Action | Fichier | Gain |
|---|---|---|---|
| 1 | `"sideEffects": false` | `package.json:20` | Débloque le tree-shaking des 53,4 Ko (A6-3) |
| 2 | Compléter les échelles `brand` et `ai` (100→900) | `design-tokens.ts:2-15` | Répare 4 composants + les cartes de la doc (A2-1, A2-3) |
| 3 | Ajouter `mdx` au glob `content` | `tailwind.config.ts:6` | Arrête la purge des classes de doc (A2-2) |
| 4 | `a11y.test: 'error'` | `.storybook/preview.ts:41` | Rend les tests d'accessibilité bloquants (A3-1) |
| 5 | Bloc `prefers-reduced-motion` | `src/index.css` | Couvre 20+ animations (A4-6) |
| 6 | Garde `max > 0` | `UsageBar.tsx:35` | Supprime `aria-valuenow={NaN}` (A1-9) |
| 7 | `min-h-6 px-2 -mx-2` sur le CTA | `UsageBar.tsx:78-81` | Conformité SC 2.5.8 (A4-7) |
| 8 | Figer les 5 versions `latest` | `package.json:63,67-71` | Builds reproductibles (A6-2) |
| 9 | `role="meter"` + `aria-value*` | `ScoreGauge.tsx:90-96` | Score enfin exposé comme valeur (A4-1) |
| 10 | Retirer `aria-live` du viewport toast | `ToastProvider.tsx:116` | Fin des doubles annonces (A4-2) |
| 11 | `<span className="sr-only">` inclus/non inclus | `PricingCard.tsx:88` | Exclusion perceptible sans la vue (A4-4) |
| 12 | Extraire les 5 props hors du `rest` | `Dropzone.tsx:45-53` | Supprime les warnings React chez tous les consommateurs (A1-1) |

**Total estimé : ~2 h** pour 12 correctifs dont 1 P0-adjacent, 8 P1.

---

## 12. Roadmap de modernisation

### Étape 1 — Rendre le package publiable (≈ 1 j) — **P0/P1**

1. Bannière `"use client"` sur l'entrée composants uniquement (A6-1).
2. `sideEffects: false`, `splitting: true`, entrées par composant, `exports` par sous-chemin (A5-1, A5-3, A6-3).
3. Versions figées, `LICENSE`, `repository` (A6-2, A6-5).
4. Sourcemaps : publier `src` ou désactiver `declarationMap`/`sourcemap` (A6-4).

*Gain* : le package devient consommable en Next.js App Router et tree-shakable. **C'est le préalable à toute publication.**

### Étape 2 — Filet de sécurité (≈ 0,5 j) — **P1**

1. Workflow CI : `type-check` + `build` + `test:storybook` (A6-7). **Reste à faire.**
2. ~~`a11y.test: 'error'`~~ — ✅ fait le 14/08, sans dérogation nécessaire, barrière vérifiée armée (A3-1).
3. Projet Vitest `unit` sur `src/lib/` + seuils de couverture (A7-1, A7-2). **Reste à faire.**

*Gain* : les étapes suivantes deviennent vérifiables au lieu d'être déclaratives.

### Étape 3 — Accessibilité (≈ 1,5 j) — **P1**

Les 7 P1 de l'axe 4 : `role="meter"` (A4-1), live regions (A4-2), `<section>` de Card (A4-3), exclusions PricingCard (A4-4), `prefers-reduced-motion` (A4-6), cible tactile (A4-7), anneau de focus Dropzone (A4-9). Puis les 5 P2. À faire **après** l'étape 2 pour que chaque correctif soit confirmé par un test rouge → vert.

*Gain* : conformité WCAG 2.2 AA défendable, addon a11y en mode bloquant sur l'ensemble du catalogue.

### Étape 4 — Tokens et cohérence Tailwind (≈ 0,5 j) — **P1/P2**

Échelles complètes (A2-1, A2-3), glob `mdx` (A2-2), rayons morts (A2-4), `extendTailwindMerge` (A2-7), tokenisation des valeurs arbitraires (A2-6). À enchaîner avec l'étape 3 : ces classes fantômes touchent les mêmes composants.

*Gain* : ce que le code déclare correspond enfin à ce que le CSS produit — prérequis à toute campagne de contrôle de contraste.

### Étape 5 — React Compiler (≈ 0,5 j) — **P2**

`babel-plugin-react-compiler@latest` + `eslint-plugin-react-hooks@latest`, câblés dans la config Vite de Storybook puis dans le build. React 19 étant déjà en place, c'est le scénario nominal documenté par React. Une fois la règle ESLint verte, retirer les mémoïsations manuelles de `ToastProvider.tsx:81-108` (A1-7).

*Gain* : mémoïsation automatique, moins de code à maintenir. **Prérequis : étape 2** — sans tests, l'activation du compilateur n'est pas vérifiable.

### Étape 6 — Migration Tailwind v3.4 → v4.3 (≈ 2-3 j) — **P2**

1. **Vérifier d'abord** que la cible navigateur du produit accepte Safari 16.4+ / Chrome 111+ / Firefox 128+ — sinon le chantier s'arrête ici et la v3.4 reste le bon choix.
2. Trancher l'arbitrage 3 (devenir de l'export preset).
3. `npx @tailwindcss/upgrade`, puis `@tailwindcss/vite` dans Storybook et `@tailwindcss/postcss` (retrait d'`autoprefixer`).
4. Relire les renommages à la main : `shadow-sm`/`shadow` (9 composants), `outline-none` → `outline-hidden` (`focus-ring.ts:2-11`), `ring` → `ring-3` (`PricingCard.tsx:61`), placement du `!`.
5. Revue visuelle story par story — d'où l'intérêt d'avoir branché la non-régression visuelle (A7-5) **avant**.

*Gain* : moteur Oxide (builds nettement plus rapides), config CSS-first, alignement sur la version courante de l'écosystème. **Aucune urgence fonctionnelle** : la v3.4 reste supportée, c'est un investissement de vélocité, à planifier après les étapes 1-4.

---

## 13. Bilan

| Sévérité | Nombre |
|---|---|
| **P0** | 1 |
| **P1** | 16 |
| **P2** | 37 |
| **Total** | **54** |

Répartition par axe : React/TS 9 · Tailwind 8 · Storybook 7 · Accessibilité 12 · Performance 5 · Build 8 · Tests 5.
