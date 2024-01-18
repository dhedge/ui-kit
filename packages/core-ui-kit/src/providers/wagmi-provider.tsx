import type { FC, ReactNode } from 'react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { arbitrum, base, optimism, polygon } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { DEFAULT_POLLING_INTERVAL } from 'const'

const { chains, publicClient } = configureChains(
  [optimism, polygon, arbitrum, base],
  [alchemyProvider({ apiKey: 'FUOJ0LrUAEKMhyyVAeUAr3_rV7cvGIWQ' })],
  { pollingInterval: DEFAULT_POLLING_INTERVAL },
)

const web3Client = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  persister: null,
})

export const WagmiProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiConfig config={web3Client}>{children}</WagmiConfig>
)
