import { PoolLogicAbi } from 'abi'
import { AddressZero } from 'const'
import {
  useAccount,
  useContractRead,
  useContractReadErrorLogging,
} from 'hooks/web3'
import type { PoolContractCallParams } from 'types/web3.types'
import { isZeroAddress } from 'utils'

export const useCheckWhitelist = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { account } = useAccount()

  const {
    data: isMemberAllowed,
    error,
    status,
  } = useContractRead({
    address: address,
    abi: PoolLogicAbi,
    functionName: 'isMemberAllowed',
    args: [account ?? AddressZero],
    chainId,
    enabled: !isZeroAddress(address) && !!account && !!chainId,
    staleTime: Infinity,
  })
  useContractReadErrorLogging({ error, status })

  return account ? !!isMemberAllowed : false
}
