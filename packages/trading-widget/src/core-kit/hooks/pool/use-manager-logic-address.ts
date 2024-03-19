import { usePoolStatic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolFallbackData } from 'core-kit/hooks/state'
import type { Address, PoolContractCallParams } from 'core-kit/types/web3.types'

export const useManagerLogicAddress = ({
  address,
  chainId,
}: PoolContractCallParams): Address | undefined => {
  const [poolData] = useTradingPanelPoolFallbackData()

  const { data: { poolManagerLogic } = {} } = usePoolStatic({
    address,
    chainId,
  })

  return poolData.managerLogicAddress ?? poolManagerLogic
}
