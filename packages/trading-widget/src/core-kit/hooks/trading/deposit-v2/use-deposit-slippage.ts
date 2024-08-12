import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

import { useAppliedDepositSlippage } from './use-applied-deposit-slippage'
import { useDepositPriceDiff } from './use-deposit-price-diff'

export const useDepositSlippage = () => {
  const isDeposit = useIsDepositTradingPanelType()
  const updateSettings = useTradingPanelSettings()[1]
  const depositSlippage = useAppliedDepositSlippage()

  const priceDiff = useDepositPriceDiff({ includesEntryFee: true })
  const priceDiffDebounced = useDebounce(priceDiff - depositSlippage, 100)

  useEffect(() => {
    if (isDeposit) {
      const minSlippage =
        priceDiffDebounced < 0
          ? Math.abs(Number(priceDiffDebounced.toFixed(2)))
          : 0
      updateSettings({ minSlippage })
    }
  }, [updateSettings, isDeposit, priceDiffDebounced])
}
