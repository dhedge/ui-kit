import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { FC, PropsWithChildren } from 'react'
import { createClient } from 'viem'
import { WagmiProvider as Provider, createConfig, http } from 'wagmi'
import { arbitrum, base, optimism, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import { ALCHEMY_RPC_URL_MAP, DEFAULT_POLLING_INTERVAL } from 'core-kit/const'

// Alchemy API key for local development
const API_KEY = ''

const config = createConfig({
  chains: [optimism, polygon, arbitrum, base],
  connectors: [injected({ shimDisconnect: true, target: 'metaMask' })],
  multiInjectedProviderDiscovery: false,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(`${ALCHEMY_RPC_URL_MAP[chain.id]}/${API_KEY}`),
      pollingInterval: DEFAULT_POLLING_INTERVAL,
    })
  },
  ssr: true,
  // storage: null,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false,
      refetchOnWindowFocus: false,
      gcTime: DEFAULT_POLLING_INTERVAL,
      staleTime: DEFAULT_POLLING_INTERVAL,
    },
  },
})

export const WagmiProvider: FC<PropsWithChildren> = ({ children }) => (
  <Provider config={config}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
)
