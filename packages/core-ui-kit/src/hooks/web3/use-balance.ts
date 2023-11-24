import { DEFAULT_POLLING_INTERVAL } from 'const'
import { useBalance as useWagmiBalance } from 'wagmi'

export const useBalance: typeof useWagmiBalance = (args) =>
  useWagmiBalance({ staleTime: DEFAULT_POLLING_INTERVAL, ...args })
