import '../src/styles/index.css'

import { TradingPanelProvider } from '@dhedge/core-ui-kit'
import {
  BRIDGED_USDC_OPTIMISM,
  DAI_OPTIMISM,
  SUSD_OPTIMISM,
  optimism,
} from '@dhedge/core-ui-kit/const'
import type {
  PoolConfig,
  TradingPanelContextConfig,
} from '@dhedge/core-ui-kit/types'
import type { Preview } from '@storybook/react'

import { Providers } from '../src/providers'

const USDY_OPTIMISM: PoolConfig = {
  chainId: optimism.id,
  symbol: 'USDy',
  address: '0x1ec50880101022c11530a069690f5446d1464592',
  depositParams: {
    method: 'depositWithCustomCooldown',
    customTokens: [],
  },
  withdrawParams: {
    customTokens: [
      BRIDGED_USDC_OPTIMISM,
      {
        ...SUSD_OPTIMISM,
        intermediateToken: BRIDGED_USDC_OPTIMISM,
        method: 'withdrawSUSD',
      },
      DAI_OPTIMISM,
    ],
  },
}

const DEMO_INITIAL_STATE: TradingPanelContextConfig['initialState'] = {
  poolConfigMap: {
    [USDY_OPTIMISM.address]: USDY_OPTIMISM,
  },
  poolAddress: USDY_OPTIMISM.address,
  poolFallbackData: {
    address: USDY_OPTIMISM.address,
    apy: {
      value: 10,
      currency: 'USD',
    },
  },
}

const DEMO_ACTIONS: TradingPanelContextConfig['actions'] = {
  onTransactionError: (...args) => {
    console.log({
      onTransactionError: args,
    })
  },
  onTransactionSuccess: (...args) => {
    console.log({
      onTransactionSuccess: args,
    })
  },
  onTransactionEstimationError: (...args) => {
    console.log({
      onTransactionEstimationError: args,
    })
  },
  onTokenSelector: (...args) => {
    console.log({
      onTokenSelector: args,
    })
  },
  onLog: (...args) => {
    console.log({
      onLog: args,
    })
  },
  onSimulateTransaction: (...args) => {
    console.log({
      onSimulateTransaction: args,
    })

    return Promise.resolve(null)
  },
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <TradingPanelProvider
        isDev
        initialState={DEMO_INITIAL_STATE}
        actions={DEMO_ACTIONS}
      >
        <Providers>
          <Story />
        </Providers>
      </TradingPanelProvider>
    ),
  ],
}

export default preview
