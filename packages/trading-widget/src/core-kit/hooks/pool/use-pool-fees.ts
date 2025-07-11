import { useMemo } from 'react'

import { MANAGER_FEE_DENOMINATOR } from 'core-kit/const'
import { usePoolDynamic } from 'core-kit/hooks/pool/multicall'
import { useTradingPanelPoolFallbackData } from 'core-kit/hooks/state'
import type { Address, ChainId } from 'core-kit/types/web3.types'
import {
  formatNumeratorToPercentage,
  getPercent,
  isEqualAddress,
} from 'core-kit/utils'

interface PoolFeesParams {
  address: Address
  chainId: ChainId
}

export const usePoolFees = ({ address, chainId }: PoolFeesParams) => {
  const [poolData] = useTradingPanelPoolFallbackData()
  const poolFallbackData = isEqualAddress(poolData.address, address)
    ? poolData
    : null
  const {
    data: {
      performanceFee,
      streamingFee,
      entryFee: entryFeeContract,
      exitFee: exitFeeContract,
    } = {},
  } = usePoolDynamic({ address, chainId })
  const entryFee =
    entryFeeContract ?? poolFallbackData?.entryFeeNumerator ?? '0'
  const exitFee = exitFeeContract ?? poolFallbackData?.exitFeeNumerator ?? '0'

  return useMemo(
    () => ({
      performanceFee: formatNumeratorToPercentage(
        performanceFee ?? poolFallbackData?.performanceFeeNumerator ?? '0',
        MANAGER_FEE_DENOMINATOR,
      ),
      streamingFee: formatNumeratorToPercentage(
        streamingFee ?? poolFallbackData?.streamingFeeNumerator ?? '0',
        MANAGER_FEE_DENOMINATOR,
        2,
      ),
      entryFee: formatNumeratorToPercentage(
        entryFee,
        MANAGER_FEE_DENOMINATOR,
        2,
      ),
      exitFee: formatNumeratorToPercentage(exitFee, MANAGER_FEE_DENOMINATOR, 2),
      exitFeeNumber: getPercent(+exitFee, MANAGER_FEE_DENOMINATOR),
    }),
    [
      performanceFee,
      poolFallbackData?.performanceFeeNumerator,
      poolFallbackData?.streamingFeeNumerator,
      streamingFee,
      entryFee,
      exitFee,
    ],
  )
}
