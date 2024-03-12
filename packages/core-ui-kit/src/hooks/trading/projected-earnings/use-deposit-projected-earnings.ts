import { useProjectedEarningsCore } from './use-projected-earnings-core'
import type { UseProjectedEarningsResult } from '../../../types'
import {
  useSendTokenInput,
  useTradingPanelPoolConfig,
  useTradingPanelPoolFallbackData,
  useTradingPanelType,
} from '../../state'
import { useAssetPrice } from '../index'

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
    return { dailyEarnings: null, yearlyEarnings: null, showEarnings: false }
  }

  return {
    showEarnings: true,
    ...projectedEarnings,
  }
}
