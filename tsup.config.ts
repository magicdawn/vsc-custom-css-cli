import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/cli.ts'],
    format: 'esm',
    target: 'node18',
    clean: true,
    esbuildOptions(options, context) {
      options.charset = 'utf8'
    },
  }
})
