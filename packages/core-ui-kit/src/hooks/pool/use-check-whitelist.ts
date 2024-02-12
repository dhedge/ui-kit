import { usePoolStatic } from 'hooks/pool/multicall'
import { useAccount } from 'hooks/web3'
import type { PoolContractCallParams } from 'types/web3.types'

export const useCheckWhitelist = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { account } = useAccount()
  const { data: { isMemberAllowed = false } = {} } = usePoolStatic({
    address,
    chainId,
  })

  return account ? isMemberAllowed : false
}
