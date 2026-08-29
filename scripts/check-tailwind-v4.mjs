/*
  Verifies the Tailwind 4 half of the `peerDependencies` claim, on both paths
  the package offers.

  `tailwindcss: ^3.4.0 || ^4.0.0` is a promise made to consumers. The v3 half is
  covered by everything else in CI; this is the v4 half.

  Two ways to consume the package under v4:

    1. `@config` pointing at a JavaScript config that applies the preset — the
       compatibility path, kept for applications already on a v3-style config.
    2. `@import "@aquellec/ui/theme.css"` — the native path, no JavaScript
       configuration at all.

  Both are asserted here because both are documented, and because the failure
  mode is silent: a v4 build with neither succeeds, reports nothing, and emits a
  style sheet with no tokens and `dark:` bound to `prefers-color-scheme` instead
  of the class strategy. Unstyled components and a dead theme switch, with no
  error to explain it.
*/
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, cpSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

for (const file of ['tailwind-preset.mjs', 'theme.css', 'index.mjs']) {
  if (!existsSync(join(dist, file))) {
    console.error(`dist/${file} is missing — run \`pnpm build\` first.`);
    process.exit(1);
  }
}

/* Properties a consumer actually depends on, whichever path they took. */
const shared = [
  ['brand scale', /\.bg-brand-600\s*\{[^}]*(#0052cc|--color-brand-600)/],
  ['semantic scale', /\.text-semantic-muted\s*\{[^}]*(#64748b|--color-semantic-muted)/],
  ['custom shadow', /\.shadow-card\s*\{[^}]*15 23 42/],
  // The load-bearing one: a media-query fallback breaks every application
  // driving the theme from a toggle.
  ['dark uses the class strategy', /\.dark\\:bg-slate-900:(is|where)\(\s*\.dark/],
  ['dark does not fall back to the media query', /^(?!.*prefers-color-scheme: dark).*$/s],
  // These assert the declarations the preset emits, not merely the at-rule:
  // Tailwind 4 ships its own reduced-motion block and color-scheme utilities.
  ['reduced-motion layer', /animation-duration:\s*0\.01ms\s*!important/],
  ['color-scheme layer', /\.dark\s*\{[^}]*color-scheme:\s*dark/],
];

/*
  Installed before anything else is placed in the sandbox: npm prunes
  `node_modules`, so a package staged there by hand would be deleted.
*/
function install(work) {
  execFileSync(
    'npm',
    /*
      `--ignore-scripts`: this is the one place in CI that fetches an unpinned
      package from the network, and the version range is open on purpose — the
      canary has to meet whatever 4.x is current. Running that download's
      install hooks is not part of the intent, and the CLI compiles without
      them.
    */
    ['install', '--silent', '--no-audit', '--no-fund', '--ignore-scripts', '--prefix', work,
     'tailwindcss@^4', '@tailwindcss/cli@^4'],
    { cwd: work, stdio: 'pipe' }
  );
}

function compile(work) {
  execFileSync(join(work, 'node_modules', '.bin', 'tailwindcss'), ['-i', 'input.css', '-o', 'out.css'], {
    cwd: work,
    stdio: 'pipe',
  });
  return readFileSync(join(work, 'out.css'), 'utf8');
}

/* Path 1: a v3-style JavaScript config, reached from the style sheet. */
function viaConfig(work) {
  install(work);
  cpSync(dist, join(work, 'dist'), { recursive: true });
  writeFileSync(join(work, 'package.json'), '{ "type": "module" }\n');
  writeFileSync(
    join(work, 'tailwind.config.js'),
    "import aquellecPreset from './dist/tailwind-preset.mjs';\n" +
      "export default { presets: [aquellecPreset], content: ['./content.html'] };\n"
  );
  writeFileSync(
    join(work, 'content.html'),
    '<div class="bg-brand-600 text-semantic-muted shadow-card dark:bg-slate-900"></div>\n'
  );
  writeFileSync(join(work, 'input.css'), '@import "tailwindcss";\n@config "./tailwind.config.js";\n');
  return compile(work);
}

/*
  Path 2: the published style sheet, installed the way npm would.

  The consumer's own markup is deliberately empty. Every class in the output can
  then only have come from the `@source` that `theme.css` declares for its own
  bundles — which is what spares applications from listing this package by hand,
  as they must under v3.
*/
function viaThemeCss(work) {
  install(work);
  const pkg = join(work, 'node_modules', '@aquellec', 'ui');
  mkdirSync(pkg, { recursive: true });
  cpSync(dist, join(pkg, 'dist'), { recursive: true });
  writeFileSync(
    join(pkg, 'package.json'),
    JSON.stringify(
      { name: '@aquellec/ui', version: '0.0.0', exports: { '.': './dist/index.mjs', './theme.css': './dist/theme.css' } },
      null,
      2
    )
  );
  writeFileSync(join(work, 'package.json'), '{ "type": "module" }\n');
  writeFileSync(join(work, 'index.html'), '<div></div>\n');
  writeFileSync(join(work, 'input.css'), '@import "tailwindcss";\n@import "@aquellec/ui/theme.css";\n');
  return compile(work);
}

const scenarios = [
  ['@config + JavaScript preset', viaConfig, shared],
  [
    '@import "@aquellec/ui/theme.css"',
    viaThemeCss,
    [...shared, ['sources registered by the package itself', /\.bg-brand-600\s*\{/]],
  ],
];

let failures = 0;

for (const [title, setup, checks] of scenarios) {
  const work = mkdtempSync(join(tmpdir(), 'aquellec-tw4-'));
  try {
    const css = setup(work);
    const version = JSON.parse(
      readFileSync(join(work, 'node_modules', 'tailwindcss', 'package.json'), 'utf8')
    ).version;
    console.log(`\n${title}  (Tailwind ${version})`);
    for (const [name, re] of checks) {
      const ok = re.test(css);
      if (!ok) failures += 1;
      console.log(`  ${ok ? ' ok ' : 'FAIL'}  ${name}`);
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (failures > 0) {
  console.error(
    `\n${failures} check(s) failed against Tailwind 4. Either fix the preset and ` +
      'theme.css, or narrow the `tailwindcss` peer range in package.json — the ' +
      'published claim and the behaviour have to agree.'
  );
  process.exit(1);
}

console.log('\nBoth Tailwind 4 paths honour the package.');
