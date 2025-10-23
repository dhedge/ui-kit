import { useReadContract } from 'wagmi'

import { PoolLogicAbi } from 'core-kit/abi'
import {
  usePoolDynamic,
  usePoolManagerStatic,
} from 'core-kit/hooks/pool/multicall'
import type { Address, ChainId } from 'core-kit/types'
import { normalizeNumber } from 'core-kit/utils'

interface UseAvailableManagerFeeParams<T = number> {
  address: Address
  chainId: ChainId
  select?: (data: bigint) => T
}

const defaultSelect = (data: bigint) => Math.ceil(normalizeNumber(data))

export const useAvailableManagerFee = <T = number>({
  address,
  chainId,
  select = defaultSelect as (data: bigint) => T,
}: UseAvailableManagerFeeParams<T>) => {
  const { data: { totalValueD18 } = {} } = usePoolDynamic({ address, chainId })
  const { data: { maxSupplyCapD18 } = {} } = usePoolManagerStatic({
    address,
    chainId,
  })

  return useReadContract({
    address,
    chainId,
    abi: PoolLogicAbi,
    functionName: 'calculateAvailableManagerFee',
    args: [BigInt(totalValueD18 ?? '0')],
    query: {
      enabled: !!totalValueD18 && !!maxSupplyCapD18 && maxSupplyCapD18 > 0n,
      select,
    },
  })
}
