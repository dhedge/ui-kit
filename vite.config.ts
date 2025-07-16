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

  resolve: {
    alias: {
      'trading-widget': path.resolve(__dirname, 'src/trading-widget'),
      'core-kit': path.resolve(__dirname, 'src/core-kit'),
      'limit-orders': path.resolve(__dirname, 'src/limit-orders'),
      theme: path.resolve(__dirname, 'src/theme'),
      styles: path.resolve(__dirname, 'src/styles'),
      examples: path.resolve(__dirname, 'src/examples'),
    },
  },

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
      external: [
        ...Object.keys(peerDependencies),
        'react/jsx-runtime',
        'react-dom',
        'scheduler',
      ],
      output: {
        globals: {
          react: 'React',
          wagmi: 'wagmi',
          viem: 'viem',
          '@tanstack/react-query': 'ReactQuery',
        },
      },
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
