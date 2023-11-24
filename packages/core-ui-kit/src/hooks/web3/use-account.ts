import type { Address } from 'types'
import { useAccount as useWagmiAccount } from 'wagmi'

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
