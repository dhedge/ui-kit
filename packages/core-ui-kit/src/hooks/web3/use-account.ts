import { useAccount as useWagmiAccount } from 'wagmi'

import type { Address } from 'types'

export const useAccount = (): Pick<
  ReturnType<typeof useWagmiAccount>,
  'status' | 'connector'
> & { account?: Address; providerName?: string } => {
  const { address, status, connector } = useWagmiAccount()
  return {
    account: address,
    status,
    connector,
    providerName: connector?.name,
  }
}
