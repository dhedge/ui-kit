import { useContractReads as useWagmiContractReads } from 'wagmi'

import { DEFAULT_POLLING_INTERVAL } from 'const'

export const useContractReads: typeof useWagmiContractReads = (args) =>
  useWagmiContractReads({ staleTime: DEFAULT_POLLING_INTERVAL, ...args })
