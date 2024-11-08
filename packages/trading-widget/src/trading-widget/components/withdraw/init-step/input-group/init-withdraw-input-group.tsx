import { WidgetInput } from 'trading-widget/components/widget/widget-input'

import { useInitWithdrawInputGroup } from 'trading-widget/components/withdraw/init-step/input-group/init-withdraw-input-group.hooks'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const InitWithdrawInputGroup = () => {
  const t = useTranslationContext()
  const { sendToken, onInputChange, receiveToken } = useInitWithdrawInputGroup()

  return (
    <>
      <WidgetInput
        label={t.sell}
        assetInput={sendToken.value}
        onInputChange={onInputChange}
        assetSymbol={sendToken.symbol}
        assetPrice={sendToken.price ?? ''}
        displayMax
        maxBalance={sendToken.balance}
        displayCalculatedValue
      />
      <WidgetInput
        label={t.receiveEstimated}
        assetInput={receiveToken.value}
        autoFocus={false}
        disabled
        assetSymbol={receiveToken.symbol}
        assetPrice={receiveToken.price}
        displayCalculatedValue
        isLoading={receiveToken.isLoading}
      />
    </>
  )
}
