/*
  Fails on Tailwind utilities whose meaning changed between v3 and v4.

  The package supports both majors. A handful of utility names were kept in v4
  with different values, so they compile cleanly under either and render
  differently — the worst kind of incompatibility, since nothing reports it.
  Measured, not quoted from the upgrade guide:

    shadow-sm         v3 0 1px 2px/.05        v4 0 1px 3px/.1 + 0 1px 2px -1px/.1
    rounded-sm        v3 0.125rem             v4 0.25rem
    blur-sm           v3 4px                  v4 8px
    backdrop-blur-sm  v3 4px                  v4 8px
    outline-none      v3 2px solid transparent  v4 outline-style: none

  The last one matters most: the transparent outline is what keeps focus visible
  in forced-colors mode, where box-shadow rings are dropped.

  Use the package's own tokens (`shadow-xs`, `shadow-card`, `shadow-overlay`) or
  an explicit value instead, so the rendering does not depend on which major the
  consumer installed.
*/
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const banned = {
  'shadow-sm': 'use shadow-xs (a token of this package) or shadow-card',
  'drop-shadow-sm': 'use an explicit value, e.g. drop-shadow-[0_1px_1px_rgb(0_0_0/0.05)]',
  'blur-sm': 'use an explicit value, e.g. blur-[4px]',
  'backdrop-blur-sm': 'use an explicit value, e.g. backdrop-blur-[4px]',
  'rounded-sm': 'use an explicit value, e.g. rounded-[0.125rem]',
  'outline-none':
    'spell the outline out: outline outline-2 outline-transparent outline-offset-2',
};

const files = globSync('{src,.storybook}/**/*.{ts,tsx,mdx}', { cwd: root })
  .filter((file) => !file.endsWith('.d.ts'));

const hits = [];

for (const file of files) {
  const source = readFileSync(resolve(root, file), 'utf8');
  /*
    Comments are skipped, block ones included: the rule is explained in prose
    right next to the code it governs, and that prose names the utilities.
  */
  let inBlockComment = false;
  source.split('\n').forEach((line, index) => {
    const trimmed = line.trimStart();
    if (inBlockComment) {
      if (line.includes('*/')) inBlockComment = false;
      return;
    }
    if (trimmed.startsWith('/*')) {
      if (!line.includes('*/')) inBlockComment = true;
      return;
    }
    if (trimmed.startsWith('*') || trimmed.startsWith('//')) return;
    for (const [utility, advice] of Object.entries(banned)) {
      if (new RegExp(`(^|[\\s'"\`:])${utility}(?![\\w-])`).test(line)) {
        hits.push(`${file}:${index + 1}  ${utility} — ${advice}`);
      }
    }
  });
}

if (hits.length > 0) {
  console.error('Utilities whose meaning differs between Tailwind 3 and 4:\n');
  for (const hit of hits) console.error(`  ${hit}`);
  console.error(`\n${hits.length} occurrence(s). See scripts/check-version-stable-utilities.mjs.`);
  process.exit(1);
}

console.log(`No version-dependent utility in ${files.length} files.`);
