import { usePoolsDynamic } from 'core-kit/hooks/pool/multicall'
import type { Address } from 'core-kit/types/web3.types'

interface PoolDynamicContractDataParams {
  address: Address
}

export const usePoolDynamicContractData = ({
  address,
}: PoolDynamicContractDataParams) => {
  const { data: poolsMap, isFetched } = usePoolsDynamic()
  const dynamicPoolData = poolsMap?.[address]

  return {
    ...dynamicPoolData,
    isFetched,
  }
}
