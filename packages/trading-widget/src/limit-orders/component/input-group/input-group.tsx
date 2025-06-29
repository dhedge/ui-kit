import classNames from 'classnames'
import type { FC } from 'react'

import { AssetPricePanel } from 'limit-orders/component/common/asset-price-panel'
import { PriceInput } from 'limit-orders/component/common/price-input'
import { SwitchPanel } from 'limit-orders/component/common/switch-panel'
import { useInputGroup } from 'limit-orders/component/input-group/input-group.hooks'
import { TermsContent } from 'limit-orders/component/input-group/terms-content'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'
import { CheckBox } from 'trading-widget/components/common/checkbox/checkbox'

export const InputGroup: FC = () => {
  const t = useTranslationContext()
  const {
    takeProfitPrice,
    setTakeProfitPrice,
    setStopLossPrice,
    onDisableTakeProfitPrice,
    onDisableStopLossPrice,
    stopLossPrice,
    setTermsAccepted,
    termsAccepted,
    pricingAssetPrice,
    takeProfitPriceDifference,
    stopLossPriceDifference,
    pricingAssetSymbol,
    isReversedOrder,
    takeProfitInputLabel,
    stopLossInputLabel,
    takeProfitInputSubtitle,
    stopLossInputSubtitle,
    inputSuffix,
  } = useInputGroup()

  return (
    <>
      <div
        className={classNames(
          'dtw-flex dtw-gap-[var(--limit-order-input-group-gap,var(--limit-order-gap))] dtw-px-[var(--limit-order-group-px)]',
          {
            'dtw-flex-col-reverse': isReversedOrder,
            'dtw-flex-col': !isReversedOrder,
          },
        )}
      >
        <AssetPricePanel
          symbol={pricingAssetSymbol}
          price={pricingAssetPrice}
        />
        <SwitchPanel
          title={takeProfitInputLabel}
          subtitle={takeProfitInputSubtitle}
          defaultEnabled={!!takeProfitPrice}
          onDisable={onDisableTakeProfitPrice}
        >
          <PriceInput
            inputValue={takeProfitPrice}
            onInputChange={setTakeProfitPrice}
            percentage={takeProfitPriceDifference}
            symbol={pricingAssetSymbol}
            suffix={inputSuffix}
          />
        </SwitchPanel>
        <SwitchPanel
          title={stopLossInputLabel}
          subtitle={stopLossInputSubtitle}
          defaultEnabled={!!stopLossPrice}
          onDisable={onDisableStopLossPrice}
        >
          <PriceInput
            inputValue={stopLossPrice}
            onInputChange={setStopLossPrice}
            percentage={stopLossPriceDifference}
            symbol={pricingAssetSymbol}
            suffix={inputSuffix}
          />
        </SwitchPanel>
      </div>
      <div className="dtw-mt-3 dtw-px-2 dtw-flex dtw-items-center dtw-gap-1.5">
        <CheckBox
          checked={termsAccepted}
          onChange={(checked) => setTermsAccepted(checked)}
          label={t.limitOrderTerms}
          labelClassName="dtw-text-[length:var(--limit-order-font-size-xs)] dtw-cursor-pointer"
        />
      </div>
      <TermsContent className="dtw-px-2" />
    </>
  )
}
