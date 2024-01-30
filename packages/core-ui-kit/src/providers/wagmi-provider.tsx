import type { FC, PropsWithChildren } from 'react'
import { WagmiProvider as Provider, createConfig, http } from 'wagmi'
import { arbitrum, base, optimism, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { createClient } from 'viem'

import { DEFAULT_POLLING_INTERVAL } from 'const'

const API_KEY = 'FUOJ0LrUAEKMhyyVAeUAr3_rV7cvGIWQ'

const RPC_URL_MAP = {
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/`,
  [polygon.id]: `https://polygon-mainnet.g.alchemy.com/v2/`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/`,
} as const

const config = createConfig({
  chains: [optimism, polygon, arbitrum, base],
  connectors: [injected()],
  multiInjectedProviderDiscovery: false,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(`${RPC_URL_MAP}${API_KEY}`, {
        batch: true,
      }),
      pollingInterval: DEFAULT_POLLING_INTERVAL,
    })
  },
  ssr: true,
  // storage: null,
})

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => (
  <Provider config={config}>{children}</Provider>
)
