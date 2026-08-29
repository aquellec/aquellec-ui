/*
  Emits `dist/theme.css`, the Tailwind 4 entry point of the package.

  Tailwind 4 reads a CSS-first configuration and ignores `tailwind.config.js`
  unless the style sheet asks for it with `@config`. That indirection is a trap:
  a consumer keeps a config file that looks wired, v4 silently ignores it, and
  the build succeeds with no tokens and `dark:` bound to `prefers-color-scheme`.

  This file removes the decoy. A v4 application imports it and gets the tokens,
  the dark variant and the base layers, with no JavaScript configuration at all.

  It is generated rather than hand-written so `src/lib/design-tokens.ts` stays
  the single source of truth: the JavaScript preset and this style sheet are two
  renderings of one object, and cannot drift.
*/
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/*
  Read from the TypeScript source rather than from the build: `dist/
  tailwind-preset.mjs` imports `tailwindcss/plugin`, which Node cannot resolve
  as ESM. The tokens are plain data, so Node's type stripping is enough and the
  generator depends on nothing but the source of truth. Hence the `--
  experimental-strip-types` flag on the `build` script.
*/
const { aquellecColors, aquellecThemeExtensions } = await import(
  resolve(import.meta.dirname, '..', 'src', 'lib', 'design-tokens.ts')
);

/** `semantic.success.fg` -> `semantic-success-fg`, leaving flat entries alone. */
function flatten(value, path = []) {
  if (typeof value === 'string') return [[path.join('-'), value]];
  return Object.entries(value).flatMap(([key, child]) => flatten(child, [...path, key]));
}

const colors = flatten(aquellecColors)
  .map(([name, hex]) => `  --color-${name}: ${hex};`)
  .join('\n');

const radii = Object.entries(aquellecThemeExtensions.borderRadius)
  .map(([name, value]) => `  --radius-${name}: ${value};`)
  .join('\n');

const shadows = Object.entries(aquellecThemeExtensions.boxShadow)
  .map(([name, value]) => `  --shadow-${name}: ${value};`)
  .join('\n');

const css = `/*
  Generated from src/lib/design-tokens.ts by scripts/generate-theme-css.mjs.
  Do not edit: run \`pnpm build\`.

  Tailwind 4 entry point. Usage:

      @import "tailwindcss";
      @import "@aquellec/ui/theme.css";

  Tailwind 3 consumers use the JavaScript preset instead, see the README.
*/

/*
  Registers the package's own bundles as a content source. Tailwind 4 skips
  node_modules when detecting sources, so without this an application would have
  to list this package by hand, exactly as it does under v3. Only the bundles are
  scanned: the source maps and declaration files carry no class names.
*/
@source "./*.{js,mjs}";

@theme {
${colors}

${radii}

${shadows}
}

/*
  The class strategy, matching \`darkMode: 'class'\` in the JavaScript preset:
  the application decides when dark applies, rather than following the operating
  system. Toggling the \`dark\` class on \`<html>\` switches everything below it.
*/
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  /*
    Declares the active scheme to the browser so its own chrome follows:
    scrollbars, form controls, spell-check underlines.
  */
  :root {
    color-scheme: light;
  }

  .dark {
    color-scheme: dark;
  }

  /* Neutralises animations when the user asks for reduced motion (WCAG 2.3.3). */
  @media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
`;

const out = resolve(import.meta.dirname, '..', 'dist', 'theme.css');
writeFileSync(out, css);
console.log(`theme.css written (${flatten(aquellecColors).length} colour tokens)`);
