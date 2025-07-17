import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useReceiveTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'

import { useSendTokenDebouncedValue } from 'core-kit/hooks/trading'
import { useAppliedDepositSlippage } from 'core-kit/hooks/trading/deposit-v2/use-applied-deposit-slippage'
import { useDepositPriceDiff } from 'core-kit/hooks/trading/deposit-v2/use-deposit-price-diff'

export const useDepositSlippage = () => {
  const isDeposit = useIsDepositTradingPanelType()
  const [receivedToken] = useReceiveTokenInput()
  const [, updateSettings] = useTradingPanelSettings()
  const { isDebouncing } = useSendTokenDebouncedValue({
    extendedDebounceTime: true,
  })

  const depositSlippage = useAppliedDepositSlippage()
  const priceDiff = useDepositPriceDiff({ includesEntryFee: true })

  useEffect(() => {
    if (!isDeposit || receivedToken.isLoading || isDebouncing) {
      return
    }

    const diff = priceDiff - depositSlippage
    const minSlippage = diff < 0 ? Math.abs(Number(diff.toFixed(2))) : 0

    updateSettings({ minSlippage })
  }, [
    updateSettings,
    isDeposit,
    receivedToken.isLoading,
    priceDiff,
    depositSlippage,
    isDebouncing,
  ])
}
