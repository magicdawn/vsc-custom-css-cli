import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/cli.ts'],
  format: 'esm',
  target: 'node18',
  clean: true,
  shims: true, // with this, free to use `__dirname` / `__filename` / `import.meta.dirname` / `import.meta.filename`
  fixedExtension: false,
})
