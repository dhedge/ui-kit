import { useBalance as useWagmiBalance } from 'wagmi'

import { DEFAULT_POLLING_INTERVAL } from 'const'

export const useBalance: typeof useWagmiBalance = (args) =>
  useWagmiBalance({ staleTime: DEFAULT_POLLING_INTERVAL, ...args })
