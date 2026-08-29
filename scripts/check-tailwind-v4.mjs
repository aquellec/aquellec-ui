/*
  Verifies the Tailwind 4 half of the `peerDependencies` claim.

  `tailwindcss: ^3.4.0 || ^4.0.0` is a promise made to consumers, and nothing
  used to check it: the preset is written in the v3 JavaScript format, while v4
  reads a CSS-first configuration and only loads a JavaScript one when the style
  sheet asks for it with `@config`.

  The failure mode is what makes this worth automating. Without that directive a
  v4 build succeeds, reports no error, and silently produces a style sheet with
  none of the tokens and with `dark:` bound to `prefers-color-scheme` instead of
  the `class` strategy. Nothing crashes; the components are simply unstyled and
  the theme switch stops working.

  The script therefore compiles the built preset with the current Tailwind 4 and
  asserts what a consumer actually depends on.
*/
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, cpSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

if (!existsSync(join(dist, 'tailwind-preset.mjs'))) {
  console.error('dist/tailwind-preset.mjs is missing — run `pnpm build` first.');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'aquellec-tw4-'));

try {
  // The preset is consumed exactly as a host application would, from the build.
  cpSync(dist, join(work, 'dist'), { recursive: true });

  writeFileSync(
    join(work, 'tailwind.config.js'),
    [
      "import aquellecPreset from './dist/tailwind-preset.mjs';",
      'export default { presets: [aquellecPreset], content: [\'./content.html\'] };',
      '',
    ].join('\n')
  );

  writeFileSync(
    join(work, 'content.html'),
    '<div class="bg-brand-600 text-semantic-muted shadow-card rounded-2xl dark:bg-slate-900"></div>\n'
  );

  writeFileSync(join(work, 'package.json'), '{ "type": "module" }\n');
  writeFileSync(join(work, 'input.css'), '@import "tailwindcss";\n@config "./tailwind.config.js";\n');

  /*
    Tailwind 4 is installed into the sandbox rather than added to this
    repository: `@import "tailwindcss"` resolves the literal package name, so a
    v4 sitting next to the v3 devDependency would be ambiguous at best. The
    range stays open on purpose — the point is to notice when a newer 4.x stops
    honouring the preset.
  */
  execFileSync(
    'npm',
    ['install', '--silent', '--no-audit', '--no-fund', '--prefix', work,
     'tailwindcss@^4', '@tailwindcss/cli@^4'],
    { cwd: work, stdio: 'pipe' }
  );

  execFileSync(
    join(work, 'node_modules', '.bin', 'tailwindcss'),
    ['-i', 'input.css', '-o', 'out.css'],
    { cwd: work, stdio: 'pipe' }
  );

  const version = JSON.parse(
    readFileSync(join(work, 'node_modules', 'tailwindcss', 'package.json'), 'utf8')
  ).version;
  console.log(`Tailwind ${version}\n`);

  const css = readFileSync(join(work, 'out.css'), 'utf8');

  const checks = [
    ['brand scale', /\.bg-brand-600\s*\{[^}]*#0052cc/],
    ['semantic scale', /\.text-semantic-muted\s*\{[^}]*#64748b/],
    ['custom shadow', /\.shadow-card\s*\{[^}]*15 23 42/],
    // The class strategy is the load-bearing one: a media-query fallback would
    // break every application driving the theme from a toggle.
    ['dark uses the class strategy', /\.dark\\:bg-slate-900:is\(\.dark \*\)/],
    ['dark does not fall back to the media query', /^(?!.*prefers-color-scheme: dark).*$/s],
    /*
      These two assert the declarations the preset plugins emit, not merely the
      at-rule or the property: Tailwind 4 ships its own `prefers-reduced-motion`
      block and its own `color-scheme` utilities, so a looser pattern passed even
      with the preset entirely absent.
    */
    ['reduced-motion plugin', /animation-duration:\s*0\.01ms\s*!important/],
    ['color-scheme plugin', /\.dark\s*\{[^}]*color-scheme:\s*dark/],
  ];

  const failed = checks.filter(([, re]) => !re.test(css));

  for (const [name, re] of checks) {
    console.log(`${re.test(css) ? '  ok  ' : ' FAIL '} ${name}`);
  }

  if (failed.length > 0) {
    console.error(
      `\n${failed.length} check(s) failed against Tailwind 4. Either fix the preset ` +
        'or narrow the `tailwindcss` peer range in package.json — the published ' +
        'claim and the behaviour have to agree.'
    );
    process.exit(1);
  }

  console.log('\nTailwind 4 honours the preset through `@config`.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
