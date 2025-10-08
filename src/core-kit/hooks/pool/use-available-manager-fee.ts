import { useReadContract } from 'wagmi'

import { PoolLogicAbi } from 'core-kit/abi'
import {
  usePoolDynamic,
  usePoolManagerStatic,
} from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolConfig } from 'core-kit/hooks/state'
import { normalizeNumber } from 'core-kit/utils'

const select = (data: bigint) => Math.ceil(normalizeNumber(data))

export const useAvailableManagerFee = () => {
  const { address, chainId } = useTradingPanelPoolConfig()
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
