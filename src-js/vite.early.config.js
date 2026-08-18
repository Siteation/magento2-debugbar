import { defineConfig } from 'vite'
import { resolve } from 'node:path'

/**
 * The early watcher is a separate, classic script so it can block in the head and run
 * before the theme's own JavaScript. It shares no code with the bundle on purpose.
 */
export default defineConfig({
  build: {
    outDir: resolve(import.meta.dirname, '../view/base/web'),
    emptyOutDir: false,
    target: 'es2019',
    lib: {
      entry: resolve(import.meta.dirname, 'src/early.js'),
      formats: ['iife'],
      name: 'SiteationDebugBarEarly',
      fileName: () => 'js/debugbar-early.js',
    },
  },
})
