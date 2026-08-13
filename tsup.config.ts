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
    esbuildOptions(options, context) {
      if (context.format === 'cjs') {
        options.footer = {
          js: 'module.exports = module.exports.default;',
        };
      }
    },
  },
]);
