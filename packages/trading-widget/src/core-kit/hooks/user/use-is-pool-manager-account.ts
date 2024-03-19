import { useIsDhedgePool } from 'core-kit/hooks/pool'
import { useAccount, useNetwork } from 'core-kit/hooks/web3'

export const useIsPoolManagerAccount = (): boolean => {
  const { account } = useAccount()
  const { chainId, supportedChainId } = useNetwork()

  return useIsDhedgePool({
    address: account,
    chainId: chainId ?? supportedChainId,
  })
}
