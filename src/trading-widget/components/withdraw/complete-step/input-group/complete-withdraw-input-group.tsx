import type { FC } from 'react'

import { WidgetInput } from 'trading-widget/components/widget/widget-input'
import { useCompleteWithdrawInputGroup } from 'trading-widget/components/withdraw/complete-step/input-group/complete-withdraw-input-group.hooks'

export const CompleteWithdrawInputGroup: FC = () => {
  const { receiveToken, swapDiff, themeType } = useCompleteWithdrawInputGroup()
  return (
    <WidgetInput
      assetInput={receiveToken.value}
      autoFocus={false}
      disabled
      assetSymbol={receiveToken.symbol}
      assetPrice={receiveToken.price}
      displayCalculatedValue
      isLoading={receiveToken.isLoading}
      tradingPriceDiff={swapDiff}
      type={themeType}
    />
  )
}
