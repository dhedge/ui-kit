import { usePoolStatic } from 'hooks/pool/multicall'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import type { Address, PoolContractCallParams } from 'types/web3.types'

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
