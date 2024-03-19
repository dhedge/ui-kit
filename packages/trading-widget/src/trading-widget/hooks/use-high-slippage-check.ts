import { useCallback, useState } from 'react'

import { useTradingPanelSettings } from 'core-kit/hooks/state'
import { useIsInsufficientBalance } from 'core-kit/hooks/user'

import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useHighSlippageCheck = () => {
  const { depositQuoteDiffErrorThreshold } = useConfigContextParams()
  const [isHighSlippageConfirmed, setIsHighSlippageConfirmed] = useState(false)
  const [{ slippage, minSlippage }] = useTradingPanelSettings()
  const slippageToBeUsed = slippage === 'auto' ? minSlippage ?? 0 : slippage
  const insufficientBalance = useIsInsufficientBalance()

  const requiresHighSlippageConfirm =
    !insufficientBalance &&
    slippageToBeUsed > depositQuoteDiffErrorThreshold &&
    !isHighSlippageConfirmed

  const confirmHighSlippage = useCallback(() => {
    setIsHighSlippageConfirmed(true)
  }, [])

  return { requiresHighSlippageConfirm, confirmHighSlippage, slippageToBeUsed }
}
