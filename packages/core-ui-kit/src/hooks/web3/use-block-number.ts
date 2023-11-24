import { DEFAULT_POLLING_INTERVAL } from 'const'
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi'

export const useBlockNumber: typeof useWagmiBlockNumber = (args) =>
  useWagmiBlockNumber({ staleTime: DEFAULT_POLLING_INTERVAL, ...args })
