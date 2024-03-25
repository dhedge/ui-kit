import { useContractPoolComposition } from 'core-kit/hooks/pool'
import { useTradingPanelPoolFallbackData } from 'core-kit/hooks/state'
import type { PoolComposition } from 'core-kit/types/pool.types'
import type { PoolContractCallParams } from 'core-kit/types/web3.types'

export const usePoolComposition = ({
  address,
  chainId,
}: PoolContractCallParams): PoolComposition[] => {
  const [poolData] = useTradingPanelPoolFallbackData()
  const poolComposition = useContractPoolComposition({ address, chainId })
  return poolComposition.length
    ? poolComposition
    : poolData.poolCompositions ?? []
}
