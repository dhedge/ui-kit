import { PoolManagerLogicAbi } from 'abi'
import { AddressZero } from 'const'
import { useManagerLogicAddress } from 'hooks/pool/use-manager-logic-address'
import {
  useContractReadErrorLogging,
  useInvalidateOnBlock,
  useReadContracts,
} from 'hooks/web3'
import type { MulticallReturnType, PoolContractCallParams } from 'types'
import { isZeroAddress } from 'utils'

const getContracts = ({ address, chainId }: PoolContractCallParams) =>
  [
    {
      address,
      abi: PoolManagerLogicAbi,
      functionName: 'getFundComposition',
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  getFundComposition: data[0].result,
})

export const usePoolManagerDynamic = ({
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
      select: selector,
    },
  })

  useInvalidateOnBlock({ queryKey: result.queryKey })

  useContractReadErrorLogging({ error: result.error, status: result.status })

  return result
}
