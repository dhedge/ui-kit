import { WidgetInput } from 'trading-widget/components/widget/widget-input'

import { useWithdrawInputGroup } from 'trading-widget/components/withdraw/unroll-step/input-group/input-group.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawInputGroup = () => {
  const t = useTranslationContext()
  const { sendToken, receiveToken, autoFocus, onInputChange } =
    useWithdrawInputGroup()

  return (
    <>
      <WidgetInput
        label={t.sell}
        assetInput={sendToken.value}
        onInputChange={onInputChange}
        autoFocus={autoFocus}
        assetSymbol={sendToken.symbol}
        assetPrice={sendToken.price ?? ''}
        displayMax
        maxBalance={sendToken.balance}
        displayCalculatedValue
      />
      <WidgetInput
        label={t.receiveEstimated}
        assetInput={receiveToken.value}
        assetSymbol={receiveToken.symbol}
        assetPrice={receiveToken.price ?? ''}
        disabled
      />
    </>
  )
}
