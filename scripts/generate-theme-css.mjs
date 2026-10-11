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
const { aquellecColors, aquellecMotion, aquellecSurfaceVariables, aquellecThemeExtensions } =
  await import(
    resolve(import.meta.dirname, '..', 'src', 'lib', 'design-tokens.ts')
  );

/** `semantic.success.fg` -> `semantic-success-fg`, leaving flat entries alone. */
function flatten(value, path = []) {
  if (typeof value === 'string') return [[path.join('-'), value]];
  return Object.entries(value).flatMap(([key, child]) => flatten(child, [...path, key]));
}

/** Emits one `--<namespace>-<name>: <value>;` line per entry, in declaration order. */
function block(namespace, entries) {
  return entries.map(([name, value]) => `  --${namespace}-${name}: ${value};`).join('\n');
}

const colors = block(
  'color',
  flatten(aquellecColors)
);

/*
  A family name containing a space has to survive the round trip into CSS, so it
  is quoted here rather than in the token file — where it is data, not syntax.
*/
const fonts = block(
  'font',
  Object.entries(aquellecThemeExtensions.fontFamily).map(([name, stack]) => [
    name,
    stack.map((family) => (family.includes(' ') ? `"${family}"` : family)).join(', '),
  ])
);

/*
  Tailwind 4 attaches a size's leading and tracking to the size itself, through
  the `--text-<name>--line-height` and `--text-<name>--letter-spacing` suffixes.
  That is the whole reason the scale is stored as `[size, { lineHeight,
  letterSpacing }]` upstream: one shape renders to both majors, and a size can
  never arrive somewhere without the two values that make it a decision.
*/
const typeScale = Object.entries(aquellecThemeExtensions.fontSize)
  .flatMap(([name, [size, { lineHeight, letterSpacing }]]) => [
    `  --text-${name}: ${size};`,
    `  --text-${name}--line-height: ${lineHeight};`,
    `  --text-${name}--letter-spacing: ${letterSpacing};`,
  ])
  .join('\n');

const tracking = block('tracking', Object.entries(aquellecThemeExtensions.letterSpacing));

const radii = block('radius', Object.entries(aquellecThemeExtensions.borderRadius));

const shadows = block('shadow', Object.entries(aquellecThemeExtensions.boxShadow));

/* `max-w-*` reads the container scale under Tailwind 4, `maxWidth` under 3. */
const measures = block('container', Object.entries(aquellecThemeExtensions.maxWidth));

const easings = block('ease', Object.entries(aquellecMotion.easing));

/*
  Durations have no theme namespace in Tailwind 4 — `duration-150` is read as a
  literal number, not as a scale lookup. They are emitted as plain custom
  properties so the values stay available to a consumer writing their own CSS,
  and components spell durations with the numeric utilities, which mean the same
  milliseconds under both majors.
*/
const durations = block('duration', Object.entries(aquellecMotion.duration));

/*
  Surface variables, emitted into the base layer rather than `@theme`: they are
  plain custom properties read by a component's inline style, not a scale
  Tailwind should generate utilities from.
*/
function surfaceBlock(values) {
  return Object.entries(values)
    .map(([name, value]) => `    ${name}: ${value};`)
    .join('\n');
}

const lightSurfaces = surfaceBlock(aquellecSurfaceVariables.light);
const darkSurfaces = surfaceBlock(aquellecSurfaceVariables.dark);

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

${fonts}

${typeScale}

${tracking}

${radii}

${shadows}

${measures}

${easings}

${durations}
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
${lightSurfaces}
  }

  .dark {
    color-scheme: dark;
${darkSurfaces}
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
console.log(
  `theme.css written (${flatten(aquellecColors).length} colour tokens, ` +
    `${Object.keys(aquellecThemeExtensions.fontSize).length} type steps)`
);
