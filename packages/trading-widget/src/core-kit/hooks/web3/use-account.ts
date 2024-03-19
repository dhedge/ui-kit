import { useAccount as useWagmiAccount } from 'wagmi'

import type { Address } from 'core-kit/types'

export const useAccount = (): Pick<
  ReturnType<typeof useWagmiAccount>,
  'status' | 'connector'
> & { account?: Address; providerName?: string; isConnected: boolean } => {
  const { address, status, connector, isConnected } = useWagmiAccount()
  return {
    account: isConnected ? address : undefined,
    status,
    connector,
    providerName: connector?.name,
    isConnected,
  }
}
