/*
  Loads the published entry points the way consumers do.

  Both were broken and nothing noticed, because everything in this repository
  imports from `src/`, never from `dist/`:

  - `require('@aquellec/ui/tailwind-preset')` returned `undefined`. A tsup
    footer ran `module.exports = module.exports.default` before esbuild had
    assigned the exports, so it read an undefined `default` and detached
    `module.exports`. The form documented on the Introduction page —
    `require('…/tailwind-preset').default` — threw a TypeError, meaning a
    Tailwind 3 consumer on a CommonJS config could not build at all.

  - `import('…/tailwind-preset.mjs')` failed under Node. The preset imported
    the extensionless `tailwindcss/plugin`, and Tailwind 3 ships no `exports`
    map, so Node's ESM resolver could not find it. Tailwind's own loader is
    more forgiving, which is why the failure stayed hidden.

  This script exercises what the package promises rather than what the source
  does, so neither can regress silently.
*/
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve(import.meta.dirname, '..', 'dist');
const require = createRequire(import.meta.url);

if (!existsSync(join(dist, 'tailwind-preset.js'))) {
  console.error('dist is missing — run `pnpm build` first.');
  process.exit(1);
}

const results = [];

function check(name, fn) {
  try {
    fn();
    results.push([true, name]);
  } catch (error) {
    results.push([false, `${name} — ${error.message}`]);
  }
}

function assertPreset(preset, label) {
  if (!preset || typeof preset !== 'object') throw new Error(`${label} is ${preset}`);
  if (preset.darkMode !== 'class') throw new Error(`${label}.darkMode is ${preset.darkMode}`);
  if (!preset.theme?.extend?.colors?.brand) throw new Error(`${label} carries no brand scale`);
  if (!Array.isArray(preset.plugins) || preset.plugins.length === 0) {
    throw new Error(`${label} carries no plugins`);
  }
}

/* The exact form documented on the Introduction page. */
check('require("tailwind-preset").default', () => {
  assertPreset(require(join(dist, 'tailwind-preset.js')).default, 'require().default');
});

check('require("tailwind-preset") exposes the raw tokens', () => {
  const cjs = require(join(dist, 'tailwind-preset.js'));
  if (!cjs.aquellecColors?.brand) throw new Error('aquellecColors missing');
  if (!cjs.aquellecThemeExtensions?.boxShadow) throw new Error('aquellecThemeExtensions missing');
});

const esm = await import(pathToFileURL(join(dist, 'tailwind-preset.mjs')).href).catch((error) => {
  results.push([false, `import("tailwind-preset.mjs") — ${error.message}`]);
  return null;
});

if (esm) {
  check('import("tailwind-preset.mjs") default', () => assertPreset(esm.default, 'ESM default'));
}

const index = await import(pathToFileURL(join(dist, 'index.mjs')).href).catch((error) => {
  results.push([false, `import("index.mjs") — ${error.message}`]);
  return null;
});

if (index) {
  check('index.mjs exports the components and helpers', () => {
    for (const name of ['Button', 'Modal', 'cn', 'focusRing', 'pageSurfaceClass']) {
      if (index[name] === undefined) throw new Error(`${name} is not exported`);
    }
  });
}

check('theme.css is published', () => {
  if (!existsSync(join(dist, 'theme.css'))) throw new Error('dist/theme.css missing');
});

for (const [ok, name] of results) console.log(`  ${ok ? ' ok ' : 'FAIL'}  ${name}`);

const failed = results.filter(([ok]) => !ok).length;
if (failed > 0) {
  console.error(`\n${failed} published entry point(s) do not load as documented.`);
  process.exit(1);
}
console.log('\nEvery published entry point loads as documented.');
