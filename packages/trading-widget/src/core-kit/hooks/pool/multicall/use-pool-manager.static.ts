import { PoolManagerLogicAbi } from 'core-kit/abi'
import { AddressZero } from 'core-kit/const'
import { useManagerLogicAddress } from 'core-kit/hooks/pool/use-manager-logic-address'
import {
  useContractReadErrorLogging,
  useReadContracts,
} from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

const getContracts = ({ address, chainId }: PoolContractCallParams) =>
  [
    {
      address: address,
      abi: PoolManagerLogicAbi,
      functionName: 'getFeeIncreaseInfo',
      chainId,
    },
    {
      address: address,
      abi: PoolManagerLogicAbi,
      functionName: 'minDepositUSD',
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  getFeeIncreaseInfo: data[0].result,
  minDepositUSD: data[1].result,
})

export const usePoolManagerStatic = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const managerLogicAddress = useManagerLogicAddress({ address, chainId })

  const result = useReadContracts({
    contracts: getContracts({
      address: managerLogicAddress ?? AddressZero,
      chainId,
    }),
    query: {
      enabled: !!managerLogicAddress && !isZeroAddress(managerLogicAddress),
      staleTime: Infinity,
      select: selector,
    },
  })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
