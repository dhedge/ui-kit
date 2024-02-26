import { useMemo } from 'react'

import { MANAGER_FEE_DENOMINATOR } from 'const'
import { usePoolDynamicContractData } from 'hooks/pool'
import { useTradingPanelEntryFee } from 'hooks/state'
import type { Address, ChainId } from 'types/web3.types'
import { formatNumeratorToPercentage } from 'utils'

interface PoolFeesParams {
  address: Address
  chainId: ChainId
}

export const usePoolFees = ({ address, chainId }: PoolFeesParams) => {
  const {
    performanceFee = '0',
    streamingFee = '0',
    entryFee: poolEntryFee,
  } = usePoolDynamicContractData({ address, chainId })
  const [easySwapperEntryFee] = useTradingPanelEntryFee()
  const hasPoolEntryFee = !!poolEntryFee && +poolEntryFee > 0

  return useMemo(
    () => ({
      performanceFee: formatNumeratorToPercentage(
        performanceFee,
        MANAGER_FEE_DENOMINATOR,
      ),
      streamingFee: formatNumeratorToPercentage(
        streamingFee,
        MANAGER_FEE_DENOMINATOR,
        2,
      ),
      entryFee: hasPoolEntryFee
        ? formatNumeratorToPercentage(poolEntryFee, MANAGER_FEE_DENOMINATOR, 2)
        : `${easySwapperEntryFee}%`,
      hasPoolEntryFee,
    }),
    [
      easySwapperEntryFee,
      hasPoolEntryFee,
      performanceFee,
      poolEntryFee,
      streamingFee,
    ],
  )
}
