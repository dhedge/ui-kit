import { defineConfig } from 'tsup'

import { peerDependencies } from './package.json'
import { getConfig } from './scripts/tsup'

export default defineConfig(
  getConfig({
    entry: [
      'src/index.ts',
      'src/abi/index.ts',
      'src/const/index.ts',
      'src/hooks/component/index.ts',
      'src/hooks/pool/index.ts',
      'src/hooks/state/index.ts',
      'src/hooks/trading/index.ts',
      'src/hooks/trading/allowance/index.ts',
      'src/hooks/trading/deposit/index.ts',
      'src/hooks/trading/withdraw/index.ts',
      'src/hooks/referral/index.ts',
      'src/hooks/user/index.ts',
      'src/hooks/utils/index.ts',
      'src/hooks/web3/index.ts',
      'src/models/index.ts',
      'src/types/index.ts',
      'src/utils/index.ts',
      'src/providers/index.tsx',
    ],
    target: 'es2021',
    sourcemap: true,
    external: [...Object.keys(peerDependencies)],
    platform: 'browser',
  }),
)
