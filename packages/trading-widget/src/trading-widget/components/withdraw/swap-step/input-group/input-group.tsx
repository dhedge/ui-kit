import type { FC } from 'react'

import { WidgetInput } from 'trading-widget/components/widget/widget-input'
import { useInputGroup } from 'trading-widget/components/withdraw/swap-step/input-group/input-group.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const InputGroup: FC = () => {
  const t = useTranslationContext()
  const { receiveToken, swapDiff, themeType } = useInputGroup()
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
