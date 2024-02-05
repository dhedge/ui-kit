import { usePoolStatic } from 'hooks/pool/multicall'
import type { PoolContractCallParams } from 'types/web3.types'

export const useCheckWhitelist = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { data: { isMemberAllowed = false } = {} } = usePoolStatic({
    address,
    chainId,
  })

  return isMemberAllowed
}
