// import '@dhedge/trading-widget/style.css';
// import { TradingPanelProvider, TradingWidget, PoolConfig, ProvidersProps, TradingPanelContextConfig, base } from '@dhedge/trading-widget';
import type { FC, PropsWithChildren } from 'react'

/** Replace by commented imports while using example */
import { TradingPanelProvider } from 'core-kit'
import { base } from 'core-kit/const'
import { WagmiProvider } from 'core-kit/providers/wagmi-provider'
import type { PoolConfig, TradingPanelContextConfig } from 'core-kit/types'
import { TradingWidget } from 'trading-widget/components'
import type { ProvidersProps } from 'trading-widget/providers'

const SYNTHETIX_BASE: PoolConfig = {
  chainId: base.id,
  symbol: 'sUSDCy',
  address: '0xc1e02884af4a283ca25ab63c45360d220d69da52',
  depositParams: {
    customTokens: [],
  },
  withdrawParams: {
    customTokens: [],
  },
}

const SIMPLE_INITIAL_STATE: TradingPanelContextConfig['initialState'] = {
  poolConfigMap: {
    [SYNTHETIX_BASE.address]: SYNTHETIX_BASE,
  },
  poolAddress: SYNTHETIX_BASE.address,
}

const SIMPLE_ACTIONS: TradingPanelContextConfig['actions'] = {
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
    /** Using of alert notification with tx error data is highly recommended */
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
  onSetTradingType: (...args) => {
    console.log({
      onSetTradingType: args,
    })
  },
  getSwapData: async () => Promise.resolve(null),
}

const SIMPLE_WIDGET_CONFIG: ProvidersProps = {
  config: {
    actions: {
      onConnect: () => {
        /** process any kind of operation (e.g. open Rainbowkit modal) to make sure wagmi's 'useAccount().account' could return connected wallet address in the end */
        console.log('connect')
      },
    },
  },
}

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <WagmiProvider>
    <TradingPanelProvider
      initialState={SIMPLE_INITIAL_STATE}
      actions={SIMPLE_ACTIONS}
    >
      {children}
    </TradingPanelProvider>
  </WagmiProvider>
)

const SimpleExample = () => (
  <Providers>
    <TradingWidget {...SIMPLE_WIDGET_CONFIG} />
  </Providers>
)

export default SimpleExample
