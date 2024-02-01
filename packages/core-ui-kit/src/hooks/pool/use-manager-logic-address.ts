import { PoolLogicAbi } from 'abi'
import { AddressZero } from 'const'
import { useTradingPanelPoolFallbackData } from 'hooks/state'
import { useContractReadErrorLogging, useReadContract } from 'hooks/web3'
import type { Address, PoolContractCallParams } from 'types/web3.types'
import { isZeroAddress } from 'utils'

export const useManagerLogicAddress = ({
  address,
  chainId,
}: PoolContractCallParams): Address | undefined => {
  const [poolData] = useTradingPanelPoolFallbackData()

  const {
    data: poolManagerLogic,
    error,
    status,
  } = useReadContract({
    address: address ?? AddressZero,
    abi: PoolLogicAbi,
    functionName: 'poolManagerLogic',
    chainId,
    query: {
      staleTime: Infinity,
      enabled:
        !poolData.managerLogicAddress && !isZeroAddress(address) && !!chainId,
    },
  })
  useContractReadErrorLogging({ error, status })

  return poolData.managerLogicAddress ?? poolManagerLogic
}
