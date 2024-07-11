import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/cli.ts'],
    format: 'esm',
    target: 'node18',
    clean: true,
    shims: true, // with this, free to use `__dirname` / `__filename` / `import.meta.dirname` / `import.meta.filename`
    esbuildOptions(options, context) {
      options.charset = 'utf8'
    },
  }
})
