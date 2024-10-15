import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import {
  useCompleteWithdrawReceiveDiff,
  useIsCompleteWithdrawStep,
} from 'core-kit/hooks/trading/withdraw-v2/complete-step'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useMinWithdrawSlippage = () => {
  const { defaultWithdrawSlippage, defaultSwapTransactionSlippage } =
    useConfigContextParams()
  const isWithdraw = !useIsDepositTradingPanelType()
  const isCompleteWithdrawStep = useIsCompleteWithdrawStep()
  const [receivedToken] = useReceiveTokenInput()

  const [, updateSettings] = useTradingPanelSettings()
  const swapDiff = useCompleteWithdrawReceiveDiff()

  useEffect(() => {
    if (!isWithdraw || receivedToken.isLoading) {
      return
    }

    if (isCompleteWithdrawStep) {
      const diff = swapDiff < 0 ? Math.abs(swapDiff) : 0
      const minSlippage = Number(
        (diff + defaultSwapTransactionSlippage).toFixed(2),
      )

      updateSettings({ minSlippage })
      return
    }

    updateSettings({ minSlippage: defaultWithdrawSlippage })
  }, [
    updateSettings,
    receivedToken.isLoading,
    isWithdraw,
    swapDiff,
    isCompleteWithdrawStep,
    defaultWithdrawSlippage,
    defaultSwapTransactionSlippage,
  ])
}
