/// <reference types='vitest' />
import { defineConfig } from 'vite'
// import banner from 'vite-plugin-banner'
import dts from 'vite-plugin-dts'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import { peerDependencies } from './package.json'

import * as path from 'path'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/trading-widget',

  plugins: [
    viteTsConfigPaths(),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
    // banner((fileName: string) => {
    //   // Or use switch statement
    //   return fileName.endsWith('.js')
    //     ? `/*/ */ import * as requireViem from 'viem';
    //    function require(m) {
    //      if (m === 'viem') return requireViem;
    //
    //      throw new Error(\`Unknown module \${m}\`);
    //    } `
    //     : null
    // }),
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
