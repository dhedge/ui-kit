import { WidgetInput } from 'components/widget/widget-input'
import { useGetThemeTypeBySlippage } from 'hooks'

import { useTranslationContext } from 'providers/translation-provider'

import { useDepositInputGroup } from './input-group.hooks'

export const DepositInputGroup = () => {
  const {
    sendToken,
    receiveToken,
    autoFocus,
    tradingPriceDiff,
    minSlippage,
    onInputFocus,
    onInputChange,
  } = useDepositInputGroup()

  const type = useGetThemeTypeBySlippage(minSlippage ?? 0)
  const t = useTranslationContext()

  return (
    <>
      <WidgetInput
        label={t.payWith}
        assetInput={sendToken.value}
        onInputChange={onInputChange}
        onInputFocus={onInputFocus}
        autoFocus={autoFocus}
        assetSymbol={sendToken.symbol}
        assetPrice={sendToken.price ?? ''}
        displayMax
        maxBalance={sendToken.balance}
        displayCalculatedValue
        isLoading={sendToken.isLoading}
      />
      <WidgetInput
        label={t.buyEstimated}
        assetInput={receiveToken.value}
        assetSymbol={receiveToken.symbol}
        assetPrice={receiveToken.price ?? ''}
        displayCalculatedValue
        disabled
        tradingPriceDiff={tradingPriceDiff}
        type={type}
        isLoading={receiveToken.isLoading}
      />
    </>
  )
}
