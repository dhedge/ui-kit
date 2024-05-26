import 'styles/index.css'

import type { Preview } from '@storybook/react'

import { TradingPanelProvider } from 'core-kit'
import { WagmiProvider } from 'core-kit/providers/wagmi-provider'
import {
  BRIDGED_USDC_OPTIMISM,
  DAI_OPTIMISM,
  SUSD_OPTIMISM,
  optimism,
} from 'core-kit/const'
import type { PoolConfig, TradingPanelContextConfig } from 'core-kit/types'

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
      <WagmiProvider>
        <TradingPanelProvider
          initialState={DEMO_INITIAL_STATE}
          actions={DEMO_ACTIONS}
        >
          <Story />
        </TradingPanelProvider>
      </WagmiProvider>
    ),
  ],
}

export default preview
