import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'lucide-react'],
    treeshake: true,
  },
  {
    entry: ['src/tailwind-preset.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: false,
    treeshake: true,
    /*
      No CJS footer here. `module.exports = module.exports.default` was appended
      before esbuild emitted the export assignments, so it read an undefined
      `default`, replaced `module.exports` with `undefined`, and the later
      `exports.default = …` wrote to a detached object. `require()` returned
      `undefined`, and the documented `require('@aquellec/ui/tailwind-preset')
      .default` threw. Without the footer the interop is esbuild's own and the
      documented form works.
    */
  },
]);
