import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/core-ui-kit',

  plugins: [
    viteTsConfigPaths({
      root: '.',
      projects: ['tsconfig.json'],
    }),
  ],
  test: {
    globals: true,
    cache: { dir: '../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./src/tests/setup.ts'],
    clearMocks: true,
  },
})
