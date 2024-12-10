import { PoolManagerLogicAbi } from 'core-kit/abi'
import { AddressZero, DEFAULT_POLLING_INTERVAL } from 'core-kit/const'
import { useManagerLogicAddress } from 'core-kit/hooks/pool/use-manager-logic-address'
import { useReadContracts } from 'core-kit/hooks/web3'
import type {
  MulticallReturnType,
  PoolContractCallParams,
} from 'core-kit/types'
import { isZeroAddress } from 'core-kit/utils'

const getContracts = ({
  chainId,
  address: managerLogicAddress,
}: PoolContractCallParams) =>
  [
    {
      address: managerLogicAddress,
      abi: PoolManagerLogicAbi,
      functionName: 'getFundComposition',
      chainId,
    },
    {
      address: managerLogicAddress,
      abi: PoolManagerLogicAbi,
      functionName: 'getSupportedAssets',
      chainId,
    },
  ] as const

type Data = MulticallReturnType<ReturnType<typeof getContracts>>

const selector = (data: Data) => ({
  getFundComposition: data[0].result,
  getSupportedAssets: data[1].result?.map(({ asset }) => asset),
})

export const usePoolManagerDynamic = ({
  address,
  chainId,
}: PoolContractCallParams) => {
  const managerLogicAddress = useManagerLogicAddress({ address, chainId })

  return useReadContracts({
    contracts: getContracts({
      address: managerLogicAddress ?? AddressZero,
      chainId,
    }),
    query: {
      enabled: !!managerLogicAddress && !isZeroAddress(managerLogicAddress),
      select: selector,
      refetchInterval: DEFAULT_POLLING_INTERVAL,
    },
  })
}
