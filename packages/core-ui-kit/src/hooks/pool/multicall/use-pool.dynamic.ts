import { PoolLogicAbi } from 'abi'
import { AddressZero } from 'const'
import {
  useAccount,
  useContractReadErrorLogging,
  useReadContracts,
} from 'hooks/web3'
import type {
  MulticallReturnType,
  PoolContractAccountCallParams,
  PoolContractCallParams,
} from 'types'
import { isZeroAddress } from 'utils'

const getContracts = ({
  address,
  chainId,
  account,
}: PoolContractAccountCallParams) =>
  [
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'getFundSummary',
      chainId,
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'tokenPrice',
      chainId,
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'isMemberAllowed',
      args: [account ?? AddressZero],
      chainId,
    },
    {
      address,
      abi: PoolLogicAbi,
      functionName: 'getExitRemainingCooldown',
      chainId,
      args: [account ?? AddressZero],
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  getFundSummary: data[0].result,
  tokenPrice: data[1].result,
  isMemberAllowed: data[2].result,
  getExitRemainingCooldown: data[3].result,
})

export const usePoolDynamic = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const { account = AddressZero } = useAccount()

  const result = useReadContracts({
    contracts: getContracts({ address, chainId, account }),
    query: {
      enabled: !!address && !isZeroAddress(address),
      select: selector,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
