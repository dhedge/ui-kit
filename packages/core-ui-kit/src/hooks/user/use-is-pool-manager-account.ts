import { useIsDhedgePool } from 'hooks/pool'
import { useAccount, useNetwork } from 'hooks/web3'

export const useIsPoolManagerAccount = (): boolean => {
  const { account } = useAccount()
  const { chainId, supportedChainId } = useNetwork()

  return useIsDhedgePool({
    address: account,
    chainId: chainId ?? supportedChainId,
  })
}
