import { WidgetInput } from 'trading-widget/components/widget/widget-input'

import { useWithdrawInputGroup } from 'trading-widget/components/withdraw/unroll-step/input-group/input-group.hooks'
import { WithdrawSection } from 'trading-widget/components/withdraw/unroll-step/input-group/withdraw-section/withdraw-section'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const WithdrawInputGroup = () => {
  const t = useTranslationContext()
  const { sendToken, receiveToken, onInputChange, isMultiAssetWithdraw } =
    useWithdrawInputGroup()

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
      <WithdrawSection
        isMultiAssetWithdraw={isMultiAssetWithdraw}
        assetSymbol={receiveToken.symbol}
      />
    </>
  )
}
