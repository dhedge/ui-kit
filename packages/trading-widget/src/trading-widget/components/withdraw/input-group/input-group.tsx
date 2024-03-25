import { WidgetInput } from 'trading-widget/components/widget/widget-input'
import { useGetThemeTypeBySlippage } from 'trading-widget/hooks'

import { useTranslationContext } from 'trading-widget/providers/translation-provider'

import { useWithdrawInputGroup } from './input-group.hooks'

export const WithdrawInputGroup = () => {
  const t = useTranslationContext()
  const { sendToken, receiveToken, minSlippage, autoFocus, onInputChange } =
    useWithdrawInputGroup()
  const type = useGetThemeTypeBySlippage(minSlippage ?? 0)

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
        type={type}
      />
    </>
  )
}
