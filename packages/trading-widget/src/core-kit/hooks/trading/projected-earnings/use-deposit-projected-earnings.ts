import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelPoolFallbackData,
  useTradingPanelType,
} from 'core-kit/hooks/state'
import { useAssetPrice } from 'core-kit/hooks/trading'
import type { UseProjectedEarningsResult } from 'core-kit/types'

import { useProjectedEarningsCore } from './use-projected-earnings-core'

export const useDepositProjectedEarnings = (): UseProjectedEarningsResult => {
  const isDepositType = useTradingPanelType()[0] === 'deposit'
  const { chainId } = useTradingPanelPoolConfig()
  const [poolFallbackData] = useTradingPanelPoolFallbackData()
  const [sendToken] = useSendTokenInput()
  const sendTokenPrice = useAssetPrice({
    address: sendToken.address,
    chainId,
    disabled: !isDepositType || !poolFallbackData.apy,
  })
  const projectedEarnings = useProjectedEarningsCore({
    chainId,
    apy: poolFallbackData.apy?.value,
    currency: poolFallbackData.apy?.currency,
    depositValueInUsd: +sendToken.value * +sendTokenPrice,
    disabled: !isDepositType,
  })

  if (!isDepositType) {
    return {
      dailyEarnings: null,
      yearlyEarnings: null,
      monthlyEarnings: null,
      showEarnings: false,
    }
  }

  return {
    showEarnings: !!poolFallbackData.apy?.value,
    ...projectedEarnings,
  }
}
