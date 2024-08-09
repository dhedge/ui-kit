import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useDebounce } from 'core-kit/hooks/utils'

import { useDepositPriceDiff } from './use-deposit-price-diff'

export const useDepositSlippage = () => {
  const isDeposit = useIsDepositTradingPanelType()
  const updateSettings = useTradingPanelSettings()[1]

  const priceDiff = useDepositPriceDiff({ includesEntryFee: true })
  const priceDiffDebounced = useDebounce(priceDiff, 100)

  useEffect(() => {
    if (isDeposit) {
      const minSlippage =
        priceDiffDebounced < 0 ? Math.abs(priceDiffDebounced) : 0
      updateSettings({ minSlippage })
    }
  }, [updateSettings, isDeposit, priceDiffDebounced])
}
