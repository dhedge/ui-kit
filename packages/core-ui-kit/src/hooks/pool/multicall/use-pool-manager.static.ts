import { PoolManagerLogicAbi } from 'abi'
import { AddressZero } from 'const'
import { useManagerLogicAddress } from 'hooks/pool/use-manager-logic-address'
import { useContractReadErrorLogging, useReadContracts } from 'hooks/web3'
import type { MulticallReturnType, PoolContractCallParams } from 'types'
import { isZeroAddress } from 'utils'

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
