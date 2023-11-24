import { DEFAULT_POLLING_INTERVAL } from 'const'
import { useContractReads as useWagmiContractReads } from 'wagmi'

export const useContractReads: typeof useWagmiContractReads = (args) =>
  useWagmiContractReads({ staleTime: DEFAULT_POLLING_INTERVAL, ...args })
