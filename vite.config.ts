/// <reference types='vitest' />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json' with { type: 'json' }
import * as path from 'path'

const { peerDependencies } = pkg as { peerDependencies: Record<string, string> }

export default defineConfig({
  root: __dirname,
  cacheDir: 'node_modules/.vite',

  plugins: [
    viteTsConfigPaths(),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
  ],

  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@dhedge/trading-widget',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: 'node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./src/tests/setup.ts'],
    clearMocks: true,
  },
}) 