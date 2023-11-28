import { useBlockNumber as useWagmiBlockNumber } from 'wagmi'

import { DEFAULT_POLLING_INTERVAL } from 'const'

export const useBlockNumber: typeof useWagmiBlockNumber = (args) =>
  useWagmiBlockNumber({ staleTime: DEFAULT_POLLING_INTERVAL, ...args })
