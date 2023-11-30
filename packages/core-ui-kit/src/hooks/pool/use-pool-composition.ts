import { useContractPoolComposition } from 'hooks/pool'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import type { PoolComposition } from 'types/pool.types'
import type { PoolContractCallParams } from 'types/web3.types'

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
