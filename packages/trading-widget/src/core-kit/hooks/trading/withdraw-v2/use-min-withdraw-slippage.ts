import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import {
  useIsWithdrawSwapStep,
  useSwapReceiveValueDiff,
} from 'core-kit/hooks/trading/withdraw-v2/swap-step'
import { useConfigContextParams } from 'trading-widget/providers/config-provider'

export const useMinWithdrawSlippage = () => {
  const { defaultWithdrawSlippage, defaultSwapTransactionSlippage } =
    useConfigContextParams()
  const isWithdraw = !useIsDepositTradingPanelType()
  const isWithdrawSwapStep = useIsWithdrawSwapStep()
  const [receivedToken] = useReceiveTokenInput()

  const [, updateSettings] = useTradingPanelSettings()
  const swapDiff = useSwapReceiveValueDiff()

  useEffect(() => {
    if (!isWithdraw || receivedToken.isLoading) {
      return
    }

    if (isWithdrawSwapStep) {
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
    isWithdrawSwapStep,
    defaultWithdrawSlippage,
    defaultSwapTransactionSlippage,
  ])
}
