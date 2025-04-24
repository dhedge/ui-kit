import { usePoolDynamicContractData } from 'core-kit/hooks/pool/'
import { usePoolManagerStatic } from 'core-kit/hooks/pool/multicall'
import { useAccount } from 'core-kit/hooks/web3'
import type { PoolContractCallParams } from 'core-kit/types/web3.types'
import { isEqualAddress } from 'core-kit/utils'

export const useCheckWhitelist = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { account } = useAccount()
  const { managerAddress } = usePoolDynamicContractData({ address })
  const { data: { isMemberAllowed = false } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })

  return account
    ? isMemberAllowed || isEqualAddress(account, managerAddress)
    : false
}
