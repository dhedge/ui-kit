/// <reference types='vitest' />
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import { peerDependencies } from './package.json'

import * as path from 'path'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/trading-widget',

  plugins: [
    viteTsConfigPaths(),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@dhedge/trading-widget',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    outDir: process.env['NX_OUTPUT_PATH'] || 'dist',
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [...Object.keys(peerDependencies)],
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./src/tests/setup.ts'],
    clearMocks: true,
  },
})
