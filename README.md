# @aquellec/ui

React UI components for recruitment SaaS products: resume parsing, ATS matching, candidate and recruiter workspaces.

**📖 [Interactive documentation](https://27473af902f42be3efeb0973435f662f.share.chromatic.com)** — the published Storybook: components, the Tokens and Introduction pages, dashboard templates.

## Why this project

A library built to serve my own side projects — a Next.js dashboard and a Python resume-analysis API. The goal was clean, accessible components, directly reusable across SaaS interfaces.

**Stack:** React 19, TypeScript, Tailwind CSS, Lucide Icons.

**Documentation and tests:** Storybook 10 — accessibility, viewports, Vitest interaction tests.

## Installation

```bash
pnpm add @aquellec/ui lucide-react
```

`react`, `react-dom` and `lucide-react` are **peer dependencies**, to be installed by the host application. `tailwindcss` is an optional peer dependency, needed only to use the preset.

### Configuring Tailwind

The package publishes no style sheet: the tokens arrive through the preset.

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

The preset carries the `brand`, `ai` and `semantic.*` palettes, the shared radii and elevations, and neutralises animations under `prefers-reduced-motion`.

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

### Using a component

```tsx
import { Button, Card, Dropzone, ToastProvider, useToast } from '@aquellec/ui';

export function App() {
  return (
    <ToastProvider>
      <Card className="max-w-md">
        <Card.Header title="Upload a resume" />
        <Card.Body>
          <Dropzone accept=".pdf" maxSizeMB={5} onFileSelect={(file) => console.log(file.name)} />
        </Card.Body>
      </Card>
    </ToastProvider>
  );
}
```

## Components

The components are generic: no business copy is hard-coded, everything comes through props.

| Family | Components |
| --- | --- |
| **Actions** | `Button` (5 variants including AI), `SegmentedControl` (exclusive segments, options as a prop) |
| **Forms** | `Input`, `Textarea` (character counter), `Dropzone` (PDF upload, single or multiple) |
| **Feedback** | `Toast` + `ToastProvider` / `useToast`, `Modal` (focus trap, `inert`), `Badge` |
| **Data Display** | `ScoreGauge` (0–100 score), `DataTable` (pagination, skeleton), `ProgressBar` (quota, configurable thresholds), `Card` (+ `Header` / `Body` / `Footer`), `PricingCard` |

**Templates** — complete Candidate and Recruiter dashboards, assembled in Storybook.

### Exported helpers

```ts
import {
  cn,                          // clsx + tailwind-merge
  aquellecColors,              // raw tokens, outside Tailwind
  aquellecThemeExtensions,     // radii and elevations
  focusRing,                   // + focusRingDanger, focusRingGhost
  getScoreTextClass,           // text colour for a score tier
} from '@aquellec/ui';
```

The surface and copy constants listed under [Dark mode](#dark-mode) are exported too.

## Design decisions

- **Composable** — sub-components (`Card.Header`, `Modal.Footer`) to keep the layout flexible.
- **Accessibility** — WAI-ARIA APG patterns, keyboard navigation, a centralised `:focus-visible`, `prefers-reduced-motion`. The a11y addon runs in blocking mode (`test: 'error'`): an axe violation fails CI.
- **Styling** — `tailwind-merge` + `clsx`, so classes can be overridden without conflict.
- **Typing** — `strict: true`, discriminated unions (`Dropzone` single / multiple), generated `.d.ts` declarations.
- **Localisation** — no copy is frozen: `Dropzone` and `DataTable` take a `labels` prop, `Modal` and `Toast` a `closeLabel`, `ScoreGauge` a set of `statusLabels`. The defaults are French, and they are exported (`defaultDropzoneLabels`, and so on) as a base for translation.
- **Distribution** — dual ESM / CJS, `sideEffects: false` for tree-shaking.
- **Tailwind majors** — the package supports 3 and 4, and avoids the utilities whose meaning changed between them (`shadow-sm`, `rounded-sm`, `blur-sm`, `outline-none`). `pnpm check:utilities` fails on any of them.
- **Headless primitives** — reserved for future floating or composite widgets (`Select`, `Combobox`, `Popover`, `Tooltip`, `Menu`); the simple APG patterns stay hand-written. See [ADR 0001](docs/adr/0001-primitives-headless.md).

## Local development

```bash
pnpm install
pnpm playwright:install   # Chromium, required by the tests

pnpm dev                  # Storybook → http://localhost:6006
pnpm type-check           # tsc --noEmit
pnpm build                # ESM/CJS build plus types in dist/
pnpm test:storybook       # Interaction and a11y tests (Vitest browser mode)
pnpm build-storybook      # Static documentation export
```

Three guards run in CI, each also runnable locally:

```bash
pnpm check:utilities      # utilities whose meaning differs between Tailwind 3 and 4
pnpm check:package        # every published entry point loads as documented
pnpm check:tailwind-v4    # the preset and theme.css compile under Tailwind 4
```

The Storybook toolbar carries a **Theme** switch (Light / Dark) driving the
stories and the documentation pages alike. The whole suite can be replayed in
dark mode, where the blocking a11y addon checks contrast against the dark
palette rather than assuming it:

```bash
STORYBOOK_THEME=dark pnpm test:storybook
```

The visual blocks of the MDX pages live in `src/docs/_showcase.tsx` and `src/docs/_tokens.tsx`, and carry the `sb-unstyled` class: without it, Storybook's own documentation styles override the Tailwind utilities.

Every token change goes through `src/lib/design-tokens.ts` — the preset, `theme.css` and the Tokens page all follow from it.

## Known limitations

- **Next.js App Router** — the `"use client"` directive is not emitted at build time yet. Import the components from a Client Component in the meantime.
- `DataTable` is not virtualised: it is meant for paginated views.

## Licence

MIT — Amandine Quellec
