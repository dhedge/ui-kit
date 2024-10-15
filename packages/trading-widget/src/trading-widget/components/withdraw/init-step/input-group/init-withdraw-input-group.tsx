import { WidgetInput } from 'trading-widget/components/widget/widget-input'

import { useInitWithdrawInputGroup } from 'trading-widget/components/withdraw/init-step/input-group/init-withdraw-input-group.hooks'
import { WithdrawSection } from 'trading-widget/components/withdraw/init-step/input-group/withdraw-section/withdraw-section'
import { useTranslationContext } from 'trading-widget/providers/translation-provider'

export const InitWithdrawInputGroup = () => {
  const t = useTranslationContext()
  const { sendToken, receiveToken, onInputChange, isMultiAssetWithdraw } =
    useInitWithdrawInputGroup()

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
