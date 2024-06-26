import { useBalance as useWagmiBalance } from 'wagmi'

import { DEFAULT_POLLING_INTERVAL } from 'core-kit/const'

export const useBalance: typeof useWagmiBalance = (args) =>
  useWagmiBalance({
    ...args,
    query: { ...args?.query, staleTime: DEFAULT_POLLING_INTERVAL },
  })
