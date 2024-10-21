import type { FC } from 'react'

import { WidgetInput } from 'trading-widget/components/widget/widget-input'
import { useCompleteWithdrawInputGroup } from 'trading-widget/components/withdraw/complete-step/input-group/complete-withdraw-input-group.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const CompleteWithdrawInputGroup: FC = () => {
  const t = useTranslationContext()
  const { receiveToken, swapDiff, themeType } = useCompleteWithdrawInputGroup()
  return (
    <WidgetInput
      label={t.receiveEstimated}
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
