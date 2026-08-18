import { defineConfig } from 'vite'
import { resolve } from 'node:path'

/**
 * Builds a single ES module plus a single stylesheet straight into the module's static
 * view directory. The output is committed, so installing the module needs no build step.
 */
export default defineConfig({
  build: {
    outDir: resolve(import.meta.dirname, '../view/base/web'),
    emptyOutDir: false,
    cssCodeSplit: false,
    target: 'es2022',
    lib: {
      entry: resolve(import.meta.dirname, 'src/debugbar.js'),
      formats: ['es'],
      fileName: () => 'js/debugbar.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'css/debugbar.css',
      },
    },
  },
})
