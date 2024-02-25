import { useTradingPanelSettings } from '@dhedge/core-ui-kit/hooks/state'
import { useIsInsufficientBalance } from '@dhedge/core-ui-kit/hooks/user'
import { useCallback, useState } from 'react'

import { useConfigContextParams } from 'providers/config-provider'

export const useHighSlippageCheck = () => {
  const { depositQuoteDiffErrorThreshold = 3 } = useConfigContextParams()
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
