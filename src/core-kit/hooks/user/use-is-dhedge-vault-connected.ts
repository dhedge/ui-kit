import { AddressZero } from 'core-kit/const'
import { useUserMulticall } from 'core-kit/hooks/user/multicall/use-user-multicall'
import { useAccount, useNetwork } from 'core-kit/hooks/web3'

export const useIsDhedgeVaultConnected = (): boolean => {
  const { account = AddressZero } = useAccount()
  const { chainId, supportedChainId } = useNetwork()

  const { data: { isUserDhedgePool } = {} } = useUserMulticall({
    address: account,
    chainId: chainId ?? supportedChainId,
  })

  return !!isUserDhedgePool
}
