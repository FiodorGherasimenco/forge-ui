import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js',
    },
    rollupOptions: {
      external: ['clsx', 'tailwind-merge'],
    },
  },
})
