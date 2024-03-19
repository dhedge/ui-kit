import { useEffect } from 'react'

import {
  useIsDepositTradingPanelType,
  useSendTokenInput,
  useTradingPanelSettings,
} from 'core-kit/hooks/state'
import { useTradingPriceDiff } from 'core-kit/hooks/trading'
import { useDebounce } from 'core-kit/hooks/utils'

export const useDepositSlippage = (receiveAssetInputValue: string) => {
  const isDeposit = useIsDepositTradingPanelType()
  const [sendToken] = useSendTokenInput()
  const updateSettings = useTradingPanelSettings()[1]
  const tradingPriceDiff = useTradingPriceDiff({
    sendAssetValue: sendToken.value,
    sendAssetAddress: sendToken.address,
    receiveAssetValue: receiveAssetInputValue,
  })
  const priceDiffDebounced = useDebounce(tradingPriceDiff, 100)

  useEffect(() => {
    if (isDeposit) {
      updateSettings({ minSlippage: Math.abs(priceDiffDebounced) })
    }
  }, [updateSettings, isDeposit, priceDiffDebounced])
}
