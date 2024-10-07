import type { FC } from 'react'

import { useWithdrawW2SwapData } from 'core-kit/hooks/trading/withdraw/v2/use-withdraw-w2-swap-data'
import { WidgetInput } from 'trading-widget/components/widget/widget-input'
import { useInputGroup } from 'trading-widget/components/withdraw/swap-step/input-group/input-group.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const InputGroup: FC = () => {
  const t = useTranslationContext()
  const { receiveToken, onInputChange } = useInputGroup()
  useWithdrawW2SwapData()
  return (
    <WidgetInput
      label={t.receiveEstimated}
      assetInput={'1'}
      autoFocus={false}
      disabled
      assetSymbol={receiveToken.symbol}
      assetPrice={receiveToken.price}
      displayCalculatedValue
      onInputChange={onInputChange}
    />
  )
}
