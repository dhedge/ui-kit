import { usePoolManagerStatic } from 'core-kit/hooks/pool/multicall'
import { useAccount } from 'core-kit/hooks/web3'
import type { PoolContractCallParams } from 'core-kit/types/web3.types'

export const useCheckWhitelist = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { account } = useAccount()
  const { data: { isMemberAllowed = false } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })

  return account ? isMemberAllowed : false
}
