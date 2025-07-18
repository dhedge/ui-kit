import type { FC } from 'react'

import { AssetPricePanel } from 'limit-orders/component/common/asset-price-panel'
import { PercentageInput } from 'limit-orders/component/common/percentage-input'
import { PriceInput } from 'limit-orders/component/common/price-input'
import { SwitchPanel } from 'limit-orders/component/common/switch-panel'
import { useInputGroup } from 'limit-orders/component/input-group/input-group.hooks'
import { TermsContent } from 'limit-orders/component/input-group/terms-content'
import { DEFAULT_SELL_PERCENTAGE } from 'limit-orders/constants'
import { useTranslationContext } from 'limit-orders/providers/translation-provider'
import { CheckBox } from 'trading-widget/components/common/checkbox/checkbox'

export const InputGroup: FC = () => {
  const t = useTranslationContext()
  const {
    upperLimitPrice,
    lowerLimitPrice,
    setUpperLimitPrice,
    setLowerLimitPrice,
    onDisableUpperLimitPrice,
    onDisableLowerLimitPrice,
    setTermsAccepted,
    termsAccepted,
    pricingAssetPrice,
    upperLimitPriceDifference,
    lowerLimitPriceDifference,
    pricingAssetSymbol,
    inputSuffix,
    sellPercentage,
    setSellPercentage,
    onDisableSellPercentage,
    coveredVaultAmount,
    vaultSymbol,
  } = useInputGroup()

  return (
    <>
      <div className="dtw-flex dtw-flex-col dtw-gap-[var(--limit-order-input-group-gap,var(--limit-order-gap))] dtw-px-[var(--limit-order-group-px)]">
        <AssetPricePanel
          symbol={pricingAssetSymbol}
          price={pricingAssetPrice}
        />
        <SwitchPanel
          title={t.upperLimitLabel}
          subtitle={t.upperLimitSubtitle}
          defaultEnabled
          onDisable={onDisableUpperLimitPrice}
        >
          <PriceInput
            inputValue={upperLimitPrice}
            onInputChange={setUpperLimitPrice}
            percentage={upperLimitPriceDifference}
            symbol={pricingAssetSymbol}
            suffix={inputSuffix}
          />
        </SwitchPanel>
        <SwitchPanel
          title={t.lowerLimitLabel}
          subtitle={t.lowerLimitSubtitle}
          defaultEnabled={!!lowerLimitPrice}
          onDisable={onDisableLowerLimitPrice}
        >
          <PriceInput
            inputValue={lowerLimitPrice}
            onInputChange={setLowerLimitPrice}
            percentage={lowerLimitPriceDifference}
            symbol={pricingAssetSymbol}
            suffix={inputSuffix}
          />
        </SwitchPanel>
        <SwitchPanel
          title={t.partialSellLabel}
          subtitle={t.partialSellSubtitle}
          defaultEnabled={!!sellPercentage}
          onDisable={onDisableSellPercentage}
        >
          <PercentageInput
            inputValue={sellPercentage}
            onInputChange={setSellPercentage}
            suffix="%"
            placeholder={DEFAULT_SELL_PERCENTAGE}
            postfix={
              <div className="dtw-flex dtw-flex-col dtw-items-end dtw-justify-center">
                <span className="dtw-text-[color:var(--limit-order-primary-content-color)]">
                  {coveredVaultAmount}
                </span>
                <span className="dtw-text-[color:var(--limit-order-secondary-content-color)]">
                  {vaultSymbol}
                </span>
              </div>
            }
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
